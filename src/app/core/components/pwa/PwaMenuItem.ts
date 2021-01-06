export class PwaMenuItem {
    constructor(
        public key: string,
        public title: string,
        public clickable: boolean,
        public subMenuItems: PwaMenuItem[] = []
    ) { }

    getAllSubItemsIncludingThis() {
        let items: PwaMenuItem[] = [this];
        this.subMenuItems.forEach(smi => items.push(...smi.getAllSubItemsIncludingThis()));
        return items;
    }

    containsPage(pageKey) {
        let contains = false;
        this.getAllSubItemsIncludingThis().forEach(smi => {
            if (smi.key === pageKey) {
                contains = true;
            }
        });
        return contains;
    }
}