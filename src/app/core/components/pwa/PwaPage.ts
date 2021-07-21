export class PwaPage {
    private _subPages: PwaPage[] = [];
    public get subPages(): PwaPage[] { return this._subPages; }

    constructor(
        public key: string,
        public title: string,
        public element?: string,
        public lazyLoadFunction: () => void = undefined,
        public needsRouteLoaded: boolean = false,
        public fullSize: boolean = false,
        public showInMenu: boolean = true,
        public is404: boolean = false
    ) { }

    addSubPage(subPage: PwaPage): PwaPage {
        this._subPages.push(subPage);
        return this;
    }

    setSubPages(subPages: PwaPage[] = []): PwaPage {
        this._subPages = subPages;
        return this;
    }

    getAllSubPagesIncludingThis(): PwaPage[] {
        let pages: PwaPage[] = [this];
        this._subPages.forEach(sp => pages.push(...sp.getAllSubPagesIncludingThis()));
        return pages;
    }

    async doLazyLoad(): Promise<void> {
        if (this.lazyLoadFunction) {
            await this.lazyLoadFunction();
        }
    }
}