export default class Model {
    constructor() {

    }

    /**
     * Clone a template
     * @param template
     * @protected
     */
    protected cloneTemplate(template: string): DocumentFragment
    {
        const raw = document.querySelector(`#templates [data-template="${template}"]`) as HTMLTemplateElement
        return raw.content.cloneNode(true) as DocumentFragment
    }
}
