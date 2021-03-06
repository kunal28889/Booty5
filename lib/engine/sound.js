/**
 * author       Mat Hopwood
 * copyright    2014 Mat Hopwood
 * More info    http://booty5.com
 */
"use strict";
//
// A Sound represents a sound effect object and can be used tp play back audio. Generally a Sound should be added to
// either a scene or the global app's resources so that it can be managed by them.
//
function Sound(name, location, reuse)
{
    // Public variables
    this.parent = null;                 // Parent container
    this.name = name;					// The sound name
    this.location = location;			// Location of the sound
    this.location2 = null;			    // Location of fallback sound
    this.loop = false;                  // If set to true the this sound will replay continuously
    if (reuse !== undefined)
        this.reuse = reuse;			    // When set to true sound effect instance will be reused
    else
        this.reuse = false;
    this.snd = null;
}

Sound.prototype.play = function()
{
    var snd;
    if (this.reuse)
        snd = this.snd;
    if (snd == null)
    {
        var inst = this;
        if (window.app.use_marm)
            snd = new Media("/android_asset/webassets/" + this.location);
        else
        {
            snd = new Audio();
            if (this.loop)
            {
                if (typeof snd.loop == "boolean")
                    snd.loop = true;
                else
                {
                    snd.addEventListener('ended', function() {
                        this.currentTime = 0;
                        this.play();
                    }, false);
                }
            }
            snd.onerror = function() {
                snd.onerror = null;
                if (inst.location2 !== null)
                {
                    snd.src = inst.location2;
                    snd.play();
                    inst.snd = snd;
                }
            };
            snd.src = this.location;
        }
    }
    snd.play();
    this.snd = snd;
    return snd;
};

Sound.prototype.stop = function()
{
    if (this.reuse && this.snd != null)
        this.snd.stop();
};

Sound.prototype.pause = function()
{
    if (this.reuse && this.snd != null)
        this.snd.pause();
};

Sound.prototype.destroy = function()
{
    if (this.parent != null)
    {
        if (window.app.use_marm)
        {
            if (window.app.use_marm && this.snd != null)
                this.snd.release();
            this.parent.removeResource(this, "sound");
        }
    }
};

