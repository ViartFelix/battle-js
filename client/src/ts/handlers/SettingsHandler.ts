import HandlersContract from "../contracts/HandlersContract";
import {modalHandler} from "./ModalHandler";
import Sound from "../models/Sound";
import {SoundType} from "./SoundHandler";

class SettingsHandler implements HandlersContract {
    constructor() {}

    init(): void
    {
        this.bindEvents()
    }

    /**
     * Binds the necessary DOM events
     * @private
     */
    private bindEvents(): void
    {
        document.querySelector('[data-btn="sounds"]')
            .addEventListener('click', (event: Event) => {
                this.handleSoundsModal(event);
            });

        document.querySelector('[data-btn="music"]')
    }

    private handleSoundsModal(event: Event): void
    {
        event.preventDefault();
        modalHandler.open("music");
    }

}

export const settingsHandler = new SettingsHandler();
