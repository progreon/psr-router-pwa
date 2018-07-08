export default function printMe() {
  console.log('I get called from print.js!');
  console.log(this);

  if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
  } else {
    console.log('Looks like we are in production mode!');
  }
}
