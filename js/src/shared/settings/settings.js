//
// Schemas and default objects for settings data
//
// https://ultrafunk.com
//


const INTEGER = 1;
const BOOLEAN = 2;
const STRING  = 3;

export {
  INTEGER as TYPE_INTEGER,
  BOOLEAN as TYPE_BOOLEAN,
  STRING  as TYPE_STRING,
};

export const PREF_PLAYER = {
  NONE:    0,
  GALLERY: 1,
  LIST:    2,
};


// ************************************************************************************************
// Ultrafunk (user) settings:     Playback, List, Gallery, Mobile and Site
// Ultrafunk (internal) settings: Tips and Banners
// ************************************************************************************************

const galleryPerPageValues       = [...Array(22).keys()].map(i => i + 3);
const galleryPerPageValueStrings = [...Array(22).keys()].map(i => `${i + 3}`);

export const settingsSchema = {
  version: { description: '', type: INTEGER, values: [1, 999999], default: 19, valueStrings: [] },
  playback: {
    preferredPlayer:      { description: 'Preferred Player',                type: INTEGER, values: [1, 2],               default: 2,     valueStrings: ['Gallery', 'List'] },
    keyboardShortcuts:    { description: 'Keyboard Shortcuts',              type: BOOLEAN, values: [true, false],        default: true,  valueStrings: ['ON', 'OFF'] },
    masterVolume:         { description: 'Master Volume',                   type: INTEGER, values: [0, 25, 50, 75, 100], default: 100,   valueStrings: ['0%', '25%', '50%', '75%', '100%'] },
    masterMute:           { description: 'Master Mute',                     type: BOOLEAN, values: [true, false],        default: false, valueStrings: ['ON', 'OFF'] },
    autoplay:             { description: 'Autoplay next track',             type: BOOLEAN, values: [true, false],        default: true,  valueStrings: ['ON', 'OFF'] },
    autoExitFullscreen:   { description: 'Exit Fullscreen on next track',   type: BOOLEAN, values: [true, false],        default: true,  valueStrings: ['ON', 'OFF'] },
    timeRemainingWarning: { description: 'Track Time Remaining Warning',    type: BOOLEAN, values: [true, false],        default: true,  valueStrings: ['ON', 'OFF'] },
    timeRemainingSeconds: { description: 'Time Remaining Warning Seconds',  type: INTEGER, values: [30, 60, 90, 120],    default: 60,    valueStrings: ['30 sec', '60 sec', '90 sec', '120 sec'] },
    autoExitFsOnWarning:  { description: 'Exit Fullscreen on Time Warning', type: BOOLEAN, values: [true, false],        default: true,  valueStrings: ['ON', 'OFF'] },
  },
  list: {
    moveTrackOnPlayNext: { description: 'Move Track on Play as Next',        type: BOOLEAN, values: [true, false], default: true, valueStrings: ['ON', 'OFF'] },
    showUpNextModal:     { description: 'Show Up Next Modal',                type: BOOLEAN, values: [true, false], default: true, valueStrings: ['ON', 'OFF'] },
    showLoadMoreTracks:  { description: 'Show "Load More Tracks..." prompt', type: BOOLEAN, values: [true, false], default: true, valueStrings: ['ON', 'OFF'] },
  },
  gallery: {
    layout:                  { description: 'Track Layout',                         type: STRING,  values: ['1-column', '2-column', '3-column'],    default: '3-column', valueStrings: ['1 Column', '2 Column', '3 / 4 Column'] },
    fetchSingleTracks:       { description: 'Play single tracks without page load', type: BOOLEAN, values: [true, false],           default: true,  valueStrings: ['ON', 'OFF'] },
    tracksPerPage:           { description: 'Tracks Per Page: Search & Shuffle',    type: INTEGER, values: galleryPerPageValues,    default: 12,    valueStrings: galleryPerPageValueStrings },
    autoCrossfade:           { description: 'Auto Crossfade to next track',         type: BOOLEAN, values: [true, false],           default: false, valueStrings: ['ON', 'OFF'] },
    autoCrossfadeLength:     { description: 'Auto Crossfade Length',                type: INTEGER, values: [5, 10, 15, 20, 25, 30], default: 20,    valueStrings: ['5 sec', '10 sec', '15 sec', '20 sec', '25 sec', '30 sec'] },
    autoCrossfadeCurve:      { description: 'Auto Crossfade Curve',                 type: INTEGER, values: [1, 2],                  default: 2,     valueStrings: ['Equal Power', 'Linear'] },
    autoScroll:              { description: 'Autoscroll to next track',             type: BOOLEAN, values: [true, false],           default: true,  valueStrings: ['ON', 'OFF'] },
    animateNowPlayingIcon:   { description: 'Animate Now Playing Track Icon',       type: BOOLEAN, values: [true, false],           default: true,  valueStrings: ['ON', 'OFF'] },
    trackCrossfadeDefPreset: { description: 'Track Crossfade Def. Preset',          type: INTEGER, values: [0, 1, 2, 3, 4, 5],      default: 1,     valueStrings: ['10 sec EqPow (1)', '20 sec EqPow (2)', '30 sec EqPow (3)', '10 sec Linear (4)', '20 sec Linear (5)', '30 sec Linear (6)'] },
  },
  mobile: {
    keepScreenOn:        { description: 'Keep Screen On when playing', type: BOOLEAN, values: [true, false], default: false, valueStrings: ['ON', 'OFF'] },
    showTrackThumbnail:  { description: 'Show Track Thumbnail',        type: BOOLEAN, values: [true, false], default: true,  valueStrings: ['ON', 'OFF'] },
    showTrackTimes:      { description: 'Show Track Times',            type: BOOLEAN, values: [true, false], default: true,  valueStrings: ['ON', 'OFF'] },
    showPrevTrackButton: { description: 'Show Previous Track button',  type: BOOLEAN, values: [true, false], default: true,  valueStrings: ['ON', 'OFF'] },
  },
  site: {
    keyboardShortcuts:   { description: 'Keyboard Shortcuts',                    type: BOOLEAN, values: [true, false],                        default: true,   valueStrings: ['ON', 'OFF'] },
    theme:               { description: 'Theme',                                 type: STRING,  values: ['light', 'dark', 'auto'],            default: 'auto', valueStrings: ['Light', 'Dark', 'Auto / System'] },
    smoothScrolling:     { description: 'Use Smooth Scrolling (where possible)', type: BOOLEAN, values: [true, false],                        default: true,   valueStrings: ['ON', 'OFF'] },
    modalOverlayOpacity: { description: 'Modal overlay opacity',                 type: INTEGER, values: [10, 20, 30, 40, 50, 60, 70, 80, 90], default: 60,     valueStrings: ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%'] },
  },
  experimental: {
    fetchNextSingleTrack: { description: '<b>Gallery Player</b><br>Play single tracks without page reload', type: BOOLEAN, values: [true, false], default: false, valueStrings: ['ON', 'OFF'] },
  },
  tips: {
    showTrackDetailsHint:          { description: '', type: BOOLEAN, values: [true, false], default: true,  valueStrings: [] },
    showUpNextModalHint:           { description: '', type: BOOLEAN, values: [true, false], default: true,  valueStrings: [] },
    showGalleryTrackThumbnailHint: { description: '', type: BOOLEAN, values: [true, false], default: true,  valueStrings: [] },
    showListTrackThumbnailHint:    { description: '', type: BOOLEAN, values: [true, false], default: true,  valueStrings: [] },
    showTrackTimerHint:            { description: '', type: BOOLEAN, values: [true, false], default: true,  valueStrings: [] },
  },
  banners: {
    showFrontpageIntro: { description: '', type: BOOLEAN, values: [true, false], default: true, valueStrings: [] },
    showPremiumIntro:   { description: '', type: BOOLEAN, values: [true, false], default: true, valueStrings: [] },
    showPromoIntro:     { description: '', type: BOOLEAN, values: [true, false], default: true, valueStrings: [] },
  }
};

export const defaultSettings = {
  version: settingsSchema.version.default,
  playback: {
    preferredPlayer:      settingsSchema.playback.preferredPlayer.default,
    keyboardShortcuts:    settingsSchema.playback.keyboardShortcuts.default,
    masterVolume:         settingsSchema.playback.masterVolume.default,
    masterMute:           settingsSchema.playback.masterMute.default,
    autoplay:             settingsSchema.playback.autoplay.default,
    autoExitFullscreen:   settingsSchema.playback.autoExitFullscreen.default,
    timeRemainingWarning: settingsSchema.playback.timeRemainingWarning.default,
    timeRemainingSeconds: settingsSchema.playback.timeRemainingSeconds.default,
    autoExitFsOnWarning:  settingsSchema.playback.autoExitFsOnWarning.default,
  },
  list: {
    moveTrackOnPlayNext: settingsSchema.list.moveTrackOnPlayNext.default,
    showUpNextModal:     settingsSchema.list.showUpNextModal.default,
    showLoadMoreTracks:  settingsSchema.list.showLoadMoreTracks.default,
  },
  gallery: {
    layout:                  settingsSchema.gallery.layout.default,
    fetchSingleTracks:       settingsSchema.gallery.fetchSingleTracks.default,
    tracksPerPage:           settingsSchema.gallery.tracksPerPage.default,
    autoCrossfade:           settingsSchema.gallery.autoCrossfade.default,
    autoCrossfadeLength:     settingsSchema.gallery.autoCrossfadeLength.default,
    autoCrossfadeCurve:      settingsSchema.gallery.autoCrossfadeCurve.default,
    autoScroll:              settingsSchema.gallery.autoScroll.default,
    animateNowPlayingIcon:   settingsSchema.gallery.animateNowPlayingIcon.default,
    trackCrossfadeDefPreset: settingsSchema.gallery.trackCrossfadeDefPreset.default,
  },
  mobile: {
    keepScreenOn:        settingsSchema.mobile.keepScreenOn.default,
    showTrackThumbnail:  settingsSchema.mobile.showTrackThumbnail.default,
    showTrackTimes:      settingsSchema.mobile.showTrackTimes.default,
    showPrevTrackButton: settingsSchema.mobile.showPrevTrackButton.default,
  },
  site: {
    keyboardShortcuts:   settingsSchema.site.keyboardShortcuts.default,
    theme:               settingsSchema.site.theme.default,
    smoothScrolling:     settingsSchema.site.smoothScrolling.default,
    modalOverlayOpacity: settingsSchema.site.modalOverlayOpacity.default,
  },
  experimental: {
    fetchNextSingleTrack: settingsSchema.experimental.fetchNextSingleTrack.default,
  },
  tips: {
    showTrackDetailsHint:          settingsSchema.tips.showTrackDetailsHint.default,
    showUpNextModalHint:           settingsSchema.tips.showUpNextModalHint.default,
    showGalleryTrackThumbnailHint: settingsSchema.tips.showGalleryTrackThumbnailHint.default,
    showListTrackThumbnailHint:    settingsSchema.tips.showListTrackThumbnailHint.default,
    showTrackTimerHint:            settingsSchema.tips.showTrackTimerHint.default,
  },
  banners: {
    showFrontpageIntro: settingsSchema.banners.showFrontpageIntro.default,
    showPremiumIntro:   settingsSchema.banners.showPremiumIntro.default,
    showPromoIntro:     settingsSchema.banners.showPromoIntro.default,
  },
};


// ************************************************************************************************
// Presets
// ************************************************************************************************

export const presetsSchema = {
  version: { description: '', type: INTEGER, values: [1, 999999], default: 1, valueStrings: [] },
  crossfade: [
    {
      name:   { description: 'Preset 1',         type: STRING,  values: [5, 50],                 default: '10 sec EqPow', valueStrings: [] },
      length: { description: 'Crossfade Length', type: INTEGER, values: [5, 10, 15, 20, 25, 30], default: 10,             valueStrings: ['5 sec', '10 sec', '15 sec', '20 sec', '25 sec', '30 sec'] },
      curve:  { description: 'Crossfade Curve',  type: INTEGER, values: [1, 2],                  default: 1,              valueStrings: ['Equal Power', 'Linear'] },
    },
    {
      name:   { description: 'Preset 2',         type: STRING,  values: [5, 50],                 default: '20 sec EqPow', valueStrings: [] },
      length: { description: 'Crossfade Length', type: INTEGER, values: [5, 10, 15, 20, 25, 30], default: 20,             valueStrings: ['5 sec', '10 sec', '15 sec', '20 sec', '25 sec', '30 sec'] },
      curve:  { description: 'Crossfade Curve',  type: INTEGER, values: [1, 2],                  default: 1,              valueStrings: ['Equal Power', 'Linear'] },
    },
    {
      name:   { description: 'Preset 3',         type: STRING,  values: [5, 50],                 default: '30 sec EqPow', valueStrings: [] },
      length: { description: 'Crossfade Length', type: INTEGER, values: [5, 10, 15, 20, 25, 30], default: 30,             valueStrings: ['5 sec', '10 sec', '15 sec', '20 sec', '25 sec', '30 sec'] },
      curve:  { description: 'Crossfade Curve',  type: INTEGER, values: [1, 2],                  default: 1,              valueStrings: ['Equal Power', 'Linear'] },
    },
    {
      name:   { description: 'Preset 4',         type: STRING,  values: [5, 50],                 default: '10 sec Linear', valueStrings: [] },
      length: { description: 'Crossfade Length', type: INTEGER, values: [5, 10, 15, 20, 25, 30], default: 10,              valueStrings: ['5 sec', '10 sec', '15 sec', '20 sec', '25 sec', '30 sec'] },
      curve:  { description: 'Crossfade Curve',  type: INTEGER, values: [1, 2],                  default: 2,               valueStrings: ['Equal Power', 'Linear'] },
    },
    {
      name:   { description: 'Preset 5',         type: STRING,  values: [5, 50],                 default: '20 sec Linear', valueStrings: [] },
      length: { description: 'Crossfade Length', type: INTEGER, values: [5, 10, 15, 20, 25, 30], default: 20,              valueStrings: ['5 sec', '10 sec', '15 sec', '20 sec', '25 sec', '30 sec'] },
      curve:  { description: 'Crossfade Curve',  type: INTEGER, values: [1, 2],                  default: 2,               valueStrings: ['Equal Power', 'Linear'] },
    },
    {
      name:   { description: 'Preset 6',         type: STRING,  values: [5, 50],                 default: '30 sec Linear', valueStrings: [] },
      length: { description: 'Crossfade Length', type: INTEGER, values: [5, 10, 15, 20, 25, 30], default: 30,              valueStrings: ['5 sec', '10 sec', '15 sec', '20 sec', '25 sec', '30 sec'] },
      curve:  { description: 'Crossfade Curve',  type: INTEGER, values: [1, 2],                  default: 2,               valueStrings: ['Equal Power', 'Linear'] },
    },
  ],
};

export const presetList = {
  version: presetsSchema.version.default,
  crossfade: [
    {
      name:   presetsSchema.crossfade[0].name.default,
      length: presetsSchema.crossfade[0].length.default,
      curve:  presetsSchema.crossfade[0].curve.default,
    },
    {
      name:   presetsSchema.crossfade[1].name.default,
      length: presetsSchema.crossfade[1].length.default,
      curve:  presetsSchema.crossfade[1].curve.default,
    },
    {
      name:   presetsSchema.crossfade[2].name.default,
      length: presetsSchema.crossfade[2].length.default,
      curve:  presetsSchema.crossfade[2].curve.default,
    },
    {
      name:   presetsSchema.crossfade[3].name.default,
      length: presetsSchema.crossfade[3].length.default,
      curve:  presetsSchema.crossfade[3].curve.default,
    },
    {
      name:   presetsSchema.crossfade[4].name.default,
      length: presetsSchema.crossfade[4].length.default,
      curve:  presetsSchema.crossfade[4].curve.default,
    },
    {
      name:   presetsSchema.crossfade[5].name.default,
      length: presetsSchema.crossfade[5].length.default,
      curve:  presetsSchema.crossfade[5].curve.default,
    },
  ],
};
