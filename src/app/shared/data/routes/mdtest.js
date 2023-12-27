let dir = 'src/app/shared/data/routes';

const fs = require('node:fs');


// var MarkdownIt = require('markdown-it'),
//     md = new MarkdownIt();

// let result = md.parse(data);
// console.debug(result);

async function main() {
    const { fromMarkdown } = await import('mdast-util-from-markdown');
    const { toMarkdown } = await import('mdast-util-to-markdown');

    const mdtest = fs.readFileSync(`${dir}/mdtest.md`, 'utf-8');

    const tree = fromMarkdown(mdtest);
    console.log(tree);

    let customTree = {
        type: 'root',
        children: [
            {
                type: 'heading',
                depth: '1',
                children: [
                    {
                        type: 'text',
                        value: 'This is a generated md file'
                    }
                ]
            },
            {
                type: 'paragraph',
                children: [
                    {
                        type: 'text',
                        value: 'This is a paragraph.'
                    }
                ]
            }
        ]
    };

    const genMd = toMarkdown(tree);
    console.log(genMd);

    console.log("done");
}

main();

// import('mdast-util-from-markdown')
//     .then((module) => {
//         const tree = module.fromMarkdown(data);
//         console.log(tree);

//         console.log("end");
//     })
//     .catch((err) => {
//         console.error(err);

//         console.log("end");
//     })
// console.log(fromMarkdown);
// const tree = fromMarkdown(data);
// console.log(tree);