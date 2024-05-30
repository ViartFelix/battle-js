import HandlersContract from "../contracts/HandlersContract";
import Sound from "../models/Sound";
import {socketService} from "../services/SocketService";
import {displayService} from "../services/DisplayService";

class SoundHandler implements HandlersContract {

    /** Audio context */
    private _audioContext: AudioContext;
    /** GainNode for music */
    private _music: GainNode;
    /** GainNode for SFX */
    private _sfx: GainNode;

    /** All available music files */
    private _allMusics: Map<string, AudioBuffer> = new Map<string, AudioBuffer>();

    /** Current Audio buffer Node source for musics. */
    private _currentSource: AudioBufferSourceNode = null
    /** Current music playing */
    private _currentMusic: string = null

    constructor() {}

    /**
     * Initialises the audio system
     * @private
     */
    public async init(): Promise<void> {
        // New audio context
        this._audioContext = new (window.AudioContext || AudioContext)();
        this._music = this._audioContext.createGain();
        this._sfx = this._audioContext.createGain();

        // Assign music and sfx to destination
        this._music.connect(this._audioContext.destination);
        this._sfx.connect(this._audioContext.destination);

        //await loading musics
        await this.loadAllMusics();

        //play random music as the audio engine is loaded.
        this.declareMusicChange()

        this._currentSource.addEventListener('ended', () => {
            this.declareMusicChange()
        })
    }

    /**
     * Loads necessary Music files
     * @private
     */
    private loadAllMusics(): Promise<void> {
        return new Promise((resolve, reject) => {
            socketService.on("musicsResponse", async (musics: Array<string>) => {
                try {
                    const loadPromises = musics.map(async (music) => {
                        const buffer = await this.loadMusic(music);
                        this._allMusics.set(music, buffer);
                    });
                    await Promise.all(loadPromises);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });

            //request musics from server
            socketService.emit("musicsRequest", []);
        });
    }

    /**
     * Loads a sound as a promise
     * @param music
     * @private
     */
    private async loadMusic(music: string): Promise<AudioBuffer> {
        const response = await fetch("music/" + music + ".mp3");
        const buffer: ArrayBuffer = await response.arrayBuffer();
        return await this._audioContext.decodeAudioData(buffer);
    }

    /**
     * Plays a random music track
     */
    public playRandomMusic(): void
    {
        //if another previous source is playing, stop it
        if(this._currentSource) {
            this._currentSource.stop();
            this._currentSource = null;
        }
        //if at least two music are loaded, play a random one
        if (this._allMusics.size > 1) {
            //get all keys from the map
            const musicKeys = Array.from(this._allMusics.keys());
            //future random music key
            let randomKey: string;

            let isMusicSame = false;
            let attempts = 0;
            //looping up to 1000 times, to make sure we get a different music than the previous one is, selected
            while (!isMusicSame && attempts < 1000) {
                //random music
                randomKey = musicKeys[Math.floor(Math.random() * musicKeys.length)];
                //if the music is the same as the previous one, try again
                isMusicSame = (randomKey !== this._currentMusic);
                attempts++;
            }

            //audio data of the selected music
            const buffer = this._allMusics.get(randomKey);

            if (buffer) {
                this.assignToSource(buffer)
                this._currentMusic = randomKey;
            }
        }
        //else we play the current music in loop
        else {
            //if there is no music loaded, load the first one
            if(!this._currentMusic) {
                this._currentMusic = this._allMusics.entries().next().value
            }
            const buffer = this._allMusics.get(this._currentMusic);

            if (buffer) {
                this.assignToSource(buffer)
            }
        }
    }

    /**
     * Assign audio data to the audio buffer
     * @param buffer
     * @private
     */
    private assignToSource(buffer: AudioBuffer): void
    {
        //create new buffer source
        this._currentSource = this._audioContext.createBufferSource();

        //assign data to the buffer
        this._currentSource.buffer = buffer;
        this._currentSource.connect(this._music);
        //start the music, DJ !
        this._currentSource.start();
    }

    public playSFX(sound: Sound): void {
        if (sound.buffer) {
            const source = this._audioContext.createBufferSource();
            source.buffer = sound.buffer;
            source.connect(this._sfx);
            source.start();
        }
    }

    public playMusic(sound: Sound): void {
        if (sound.buffer) {
            const source = this._audioContext.createBufferSource();
            source.buffer = sound.buffer;
            source.connect(this._music);
            source.start();
        }
    }

    /**
     * Handles when the current music has finished playing, and loads a new one
     * @private
     */
    public declareMusicChange(): void
    {
        this.playRandomMusic();

        if(this._currentMusic) {
            displayService.updateDisplay('current-music', this._currentMusic)
        }
    }

    /**
     * Sets the volume of the music
     * @param value
     */
    public setMusicVolume(value: number): void {
        if (value >= 0 && value <= 100) {
            this._music.gain.value = value / 100;
        }
    }

    /**
     * Sets the volume of the SFX
     * @param value
     */
    public setSfxVolume(value: number): void {
        if (value >= 0 && value <= 100) {
            this._sfx.gain.value = value / 100;
        }
    }

    get audioContext(): AudioContext { return this._audioContext; }
    get music(): GainNode { return this._music; }
    get sfx(): GainNode { return this._sfx; }

    get allMusics(): Map<string, AudioBuffer> { return this._allMusics; }
    get currentSource(): AudioBufferSourceNode { return this._currentSource; }
    get currentMusic(): string { return this._currentMusic; }
}

export const soundHandler = new SoundHandler();

export enum SoundType {
    MUSIC = 1,
    SFX = 0
}
