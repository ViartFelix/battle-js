import Model from "./Model";
import {soundHandler, SoundType} from "../handlers/SoundHandler";

export default class Sound extends Model {

    /** src of the audio */
    private readonly _src: string;
    /** Buffer of the audio */
    private _buffer: AudioBuffer;

    /**
     * Plays a sound with the given SRC
     * @param src
     */
    constructor(src: string) {
        super()

        this._src = src;
    }

    /**
     * Loads the audio from the src
     * @private
     */
    public async loadAudio(): Promise<any>
    {
        //getting audio data
        const res = await fetch(this._src);
        //buffer
        const buffer = await res.arrayBuffer();
        //and decoding data
        this._buffer = await soundHandler.audioContext.decodeAudioData(buffer);

        return Promise.resolve();
    }

    /**
     * Plays the sound
     */
    public play(type: SoundType): void
    {
        switch (type) {
            case SoundType.MUSIC:
                soundHandler.playMusic(this);
                break;
            case SoundType.SFX:
                soundHandler.playSFX(this);
                break;
        }
    }

    get src(): string { return this._src; }
    get buffer(): AudioBuffer { return this._buffer; }
}
