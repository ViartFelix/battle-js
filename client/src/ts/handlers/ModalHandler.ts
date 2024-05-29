import HandlersContract from "../contracts/HandlersContract";
import {soundHandler} from "./SoundHandler";

class ModalHandler implements HandlersContract {
    /** container of all modals (parent) */
    private _container: HTMLElement;
    /** array of all modals */
    private _allModals: Array<HTMLElement>;
    /** currently opened modal */
    private _currentModal: Element|null;

    constructor() {
    }

    public init(): void {
        //container of modals
        this._container = document.getElementById("modals") as HTMLElement;
        //all modals
        this._allModals = Array.from(this._container.querySelectorAll("[data-modal]")) as Array<HTMLElement>;
        this.bindEvents();

        this.open("startup")
    }

    /**
     * Binds DOM events to the modals
     * @private
     */
    private bindEvents(): void
    {
        //bind common modal events: closing the modal using a button
        this._allModals.forEach((modal) => {
            const btnClose = modal.querySelector('[data-modal-btn="close"]')
            if(btnClose) {
                btnClose.addEventListener("click", () => {
                    this.close(modal.dataset.modal);
                });
            }
        })
        //then bind each modal specific events
        //handle SFX change
        this._container.querySelector("[data-modal='music'] [data-modal-el='input-sfx']")
            .addEventListener('input', (event: Event) => {
                this.handleSFXChange(event)
            })
        //handle music change
        this._container.querySelector("[data-modal='music'] [data-modal-el='input-music']")
            .addEventListener('input', (event: Event) => {
                this.handleMusicChange(event)
            })

        this._container.querySelector("[data-modal='startup'] [data-modal-el='start-button']")
            .addEventListener('click', (event: Event) => {
                //no need to close, because we attributed the button to close as the start button.
                soundHandler.init()
            })
    }

    /**
     * Handles the change of the SFX volume
     * @param event
     * @private
     */
    private handleSFXChange(event: Event): void
    {
        const input = event.target as HTMLInputElement;
        const value: number = parseInt(input.value);

        this._currentModal.querySelector("[data-display='sfx-volume']")
            .textContent = value.toString();

        soundHandler.setSfxVolume(value);
    }

    /**
     * Handles changing the music volume
     * @param event
     * @private
     */
    private handleMusicChange(event: Event): void
    {
        const input = event.target as HTMLInputElement;
        const value: number = parseInt(input.value);

        this._currentModal.querySelector("[data-display='music-volume']")
            .textContent = value.toString();

        soundHandler.setMusicVolume(value);
    }


    /**
     * Opens a modal
     * @param modal
     */
    public open(modal: string): void {
        const target: Element = this._container.querySelector(`[data-modal='${modal}']`)

        target.classList.add("open");
        this._currentModal = target
    }

    /**
     * Close a modal
     * @param modal
     */
    public close(modal: string): void {
        const target: Element = this._container.querySelector(`[data-modal='${modal}']`)
        target.classList.remove("open");
        this._currentModal = null;
    }

    /**
     * Closes all the modals
     */
    public closeAll(): void
    {
        this._allModals.forEach((modal) => {
            this.close(modal.dataset.modal);
        });
    }
}

export const modalHandler = new ModalHandler();
