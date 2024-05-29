import HandlersContract from "../contracts/HandlersContract";
import Sound from "../models/Sound";
import {displayService} from "../services/DisplayService";

class SoundHandler implements HandlersContract {

    /** Audio context */
    private _audioContext: AudioContext;
    /** GainNode for music */
    private _music: GainNode;
    /** GainNode for SFX */
    private _sfx: GainNode;
    /** Current playing sounds */
    private _currentSounds: Array<Sound> = [];

    constructor() {}

    /**
     * Initialises the audio system
     * @private
     */
    public init(): void
    {
        //new audio context
        this._audioContext = new (window.AudioContext || AudioContext)();
        this._music = this._audioContext.createGain();
        this._sfx = this._audioContext.createGain();

        //assign music and sfx to destination
        this._music.connect(this._audioContext.destination);
        this._sfx.connect(this._audioContext.destination);

        this.playRandomMusic();
    }

    /**
     * Loads necessary SFXs files
     * @private
     */
    private loadSFX()
    {
        //TODO
    }

    /**
     * Plays a random music track
     */
    public playRandomMusic(): void
    {
        //TODO: take musics of orna and make event listener
        const sound = new Sound("music/On Our Way.mp3")
        sound.loadAudio().then(() => this.playMusic(sound))
    }

    public playSFX(sound: Sound): void
    {
        //new audio source
        const source = this._audioContext.createBufferSource();
        //connect source to gain
        source.buffer = sound.buffer;
        source.connect(this._sfx);
        source.start();
    }

    public playMusic(sound: Sound): void
    {
        const source = this._audioContext.createBufferSource();
        source.buffer = sound.buffer;
        source.connect(this._music);
        source.start();
    }


    /**
     * Sets the volume of the music
     * @param value
     */
    public setMusicVolume(value: number): void
    {
        if(value >= 0 && value <= 100) {
            this._music.gain.value = value / 10;
        }
    }

    /**
     * Sets the volume of the SFX
     * @param value
     */
    public setSfxVolume(value: number): void
    {
        //if value is in range
        if(value >= 0 && value <= 100) {
            this._sfx.gain.value = value / 10;
        }
    }

    get audioContext(): AudioContext { return this._audioContext; }
    get music(): GainNode { return this._music; }
    get sfx(): GainNode { return this._sfx; }
}

export const soundHandler = new SoundHandler();

export enum SoundType {
    MUSIC = 1,
    SFX = 0
}
