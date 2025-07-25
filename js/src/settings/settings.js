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
// Ultrafunk (user) settings: Playback, List, Gallery, Mobile and Site (+ Experimental)
// Other Ultrafunk settings:  Internal
// ************************************************************************************************

const masterVolumeValues         = [ 5,    10,    15,    20,    25,    30,    35,    40,    45,    50,    55,    60,    65,    70,    75,    80,    85,    90,    95,    100  ];
const masterVolumeValueStrings   = ['5%', '10%', '15%', '20%', '25%', '30%', '35%', '40%', '45%', '50%', '55%', '60%', '65%', '70%', '75%', '80%', '85%', '90%', '95%', '100%'];

const listPerPageValues          = [ 10,   15,   20,   25,   30,   35,   40,   45,   50 ];
const listPerPageValueStrings    = ['10', '15', '20', '25', '30', '35', '40', '45', '50'];

const galleryPerPageValues       = [ 4,   6,   8,   10,   12,   14,   16,   18,   20,   22,   24 ];
const galleryPerPageValueStrings = ['4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24'];

const trackCrossfadeDefPresetValueStrings = ['10 sec EqPow (1)', '20 sec EqPow (2)', '30 sec EqPow (3)', '10 sec Linear (4)', '20 sec Linear (5)', '30 sec Linear (6)'];

export const settingsSchema = {
  version: { description: '', type: INTEGER, values: [1, 999999], default: 42, valueStrings: [] },
  playback: {
    preferredPlayer:      { description: 'Preferred Player',                type: INTEGER, values: [1, 2],               default: 2,     valueStrings: ['Gallery', 'List'] },
    keyboardShortcuts:    { description: 'Keyboard Shortcuts',              type: BOOLEAN, values: [true, false],        default: true,  valueStrings: ['ON', 'OFF'] },
    masterVolume:         { description: 'Master Volume',                   type: INTEGER, values: masterVolumeValues,   default: 100,   valueStrings: masterVolumeValueStrings },
    masterMute:           { description: 'Master Mute',                     type: BOOLEAN, values: [true, false],        default: false, valueStrings: ['ON', 'OFF'] },
    pauseOnPlayerChange:  { description: 'Pause others on player change',   type: BOOLEAN, values: [true, false],        default: true,  valueStrings: ['ON', 'OFF'] },
    autoplay:             { description: 'Autoplay next track',             type: BOOLEAN, values: [true, false],        default: true,  valueStrings: ['ON', 'OFF'] },
    autoExitFullscreen:   { description: 'Exit Fullscreen on next track',   type: BOOLEAN, values: [true, false],        default: true,  valueStrings: ['ON', 'OFF'] },
    timeRemainingWarning: { description: 'Track Time Remaining Warning',    type: BOOLEAN, values: [true, false],        default: true,  valueStrings: ['ON', 'OFF'] },
    timeRemainingSeconds: { description: 'Time Remaining Warning Seconds',  type: INTEGER, values: [30, 60, 90, 120],    default: 60,    valueStrings: ['30 sec', '60 sec', '90 sec', '120 sec'] },
    autoExitFsOnWarning:  { description: 'Exit Fullscreen on Time Warning', type: BOOLEAN, values: [true, false],        default: true,  valueStrings: ['ON', 'OFF'] },
  },
  list: {
    realtimeTrackSearch:   { description: 'Show realtime Track Search results',     type: BOOLEAN, values: [true, false],     default: true,  valueStrings: ['ON', 'OFF'] },
    searchLocalTracks:     { description: 'Include local tracks in Realtime Search',type: BOOLEAN, values: [true, false],     default: true,  valueStrings: ['ON', 'OFF'] },
    maxTrackSearchResults: { description: 'Max number of Track Search results',     type: INTEGER, values: [12, 24, 36, 48],  default: 24,    valueStrings: ['12', '24', '36', '48'] },
    queryAllTrackArtists:  { description: 'Track Search: Query all Track Artists',  type: BOOLEAN, values: [true, false],     default: true,  valueStrings: ['ON', 'OFF'] },
    queryAllTrackChannels: { description: 'Track Search: Query all Track Channels', type: BOOLEAN, values: [true, false],     default: true,  valueStrings: ['ON', 'OFF'] },
    moveTrackOnPlayNext:   { description: 'Move Track on Play as Next',             type: BOOLEAN, values: [true, false],     default: true,  valueStrings: ['ON', 'OFF'] },
    showUpNextModal:       { description: 'Show Up Next Modal',                     type: BOOLEAN, values: [true, false],     default: true,  valueStrings: ['ON', 'OFF'] },
    showLoadMoreTracks:    { description: 'Show "Load More Tracks..." prompt',      type: BOOLEAN, values: [true, false],     default: true,  valueStrings: ['ON', 'OFF'] },
    tracksPerPage:         { description: 'Tracks Per Page: Search & Shuffle',      type: INTEGER, values: listPerPageValues, default: 25,    valueStrings: listPerPageValueStrings },
    enableLocalPlayback:   { description: 'Enable local (device) tracks playback',  type: BOOLEAN, values: [true, false],     default: false, valueStrings: ['ON', 'OFF'] },
    sortLocalTracks:       { description: 'Sort local tracks alphabetically (asc.)',type: BOOLEAN, values: [true, false],     default: true,  valueStrings: ['ON', 'OFF'] },
    warnOnPageChange:      { description: 'Show Warning Prompt on Page Change',     type: BOOLEAN, values: [true, false],     default: false, valueStrings: ['ON', 'OFF'] },
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
    trackCrossfadeDefPreset: { description: 'Track Crossfade Def. Preset',          type: INTEGER, values: [0, 1, 2, 3, 4, 5],      default: 1,     valueStrings: trackCrossfadeDefPresetValueStrings },
  },
  mobile: {
    keepScreenOn:        { description: 'Keep Screen On when playing', type: BOOLEAN, values: [true, false], default: false, valueStrings: ['ON', 'OFF'] },
    showTrackThumbnail:  { description: 'Show Track Thumbnail',        type: BOOLEAN, values: [true, false], default: true,  valueStrings: ['ON', 'OFF'] },
    showTrackTimes:      { description: 'Show Track Times',            type: BOOLEAN, values: [true, false], default: true,  valueStrings: ['ON', 'OFF'] },
    showPrevTrackButton: { description: 'Show Previous Track button',  type: BOOLEAN, values: [true, false], default: true,  valueStrings: ['ON', 'OFF'] },
  },
  site: {
    keyboardShortcuts:   { description: 'Keyboard Shortcuts',                    type: BOOLEAN, values: [true, false],                        default: true,   valueStrings: ['ON', 'OFF'] },
    theme:               { description: 'Theme',                                 type: STRING,  values: ['light', 'dark', 'black', 'auto'],   default: 'auto', valueStrings: ['Light', 'Dark', 'Black', 'Auto / System'] },
    smoothScrolling:     { description: 'Use Smooth Scrolling (where possible)', type: BOOLEAN, values: [true, false],                        default: true,   valueStrings: ['ON', 'OFF'] },
    overlayOpacity:      { description: 'Overlay opacity',                       type: INTEGER, values: [10, 20, 30, 40, 50, 60, 70, 80, 90], default: 60,     valueStrings: ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%'] },
    snackbarMessageLog:  { description: 'Enable Snackbar message log',           type: BOOLEAN, values: [true, false],                        default: false,  valueStrings: ['ON', 'OFF'] },
  },
  internal: {
  //showSiteInfoOnLoad: { description: '', type: BOOLEAN, values: [true, false], default: true, valueStrings: [] },
  },
  experimental: {
  //enableLocalPlayback:  { description: '<b>List Player</b><br>Enable local (device) track playback',      type: BOOLEAN, values: [true, false], default: false, valueStrings: ['ON', 'OFF'] },
  //enableDjPlayer:       { description: '<b>List Player</b><br>Enable DJ Player testing',                  type: BOOLEAN, values: [true, false], default: false, valueStrings: ['ON', 'OFF'] },
  //realtimeTrackSearch:  { description: '<b>List Player</b><br>Show realtime track search results',        type: BOOLEAN, values: [true, false], default: false, valueStrings: ['ON', 'OFF'] },
  //fetchNextSingleTrack: { description: '<b>Gallery Player</b><br>Play single tracks without page reload', type: BOOLEAN, values: [true, false], default: false, valueStrings: ['ON', 'OFF'] },
  },
};

const playback     = settingsSchema.playback,
      list         = settingsSchema.list,
      gallery      = settingsSchema.gallery,
      mobile       = settingsSchema.mobile,
      site         = settingsSchema.site,
      internal     = settingsSchema.internal,      // eslint-disable-line no-unused-vars
      experimental = settingsSchema.experimental;  // eslint-disable-line no-unused-vars

export const defaultSettings = {
  version: settingsSchema.version.default,
  playback: {
    preferredPlayer:      playback.preferredPlayer.default,
    keyboardShortcuts:    playback.keyboardShortcuts.default,
    masterVolume:         playback.masterVolume.default,
    masterMute:           playback.masterMute.default,
    pauseOnPlayerChange:  playback.pauseOnPlayerChange.default,
    autoplay:             playback.autoplay.default,
    autoExitFullscreen:   playback.autoExitFullscreen.default,
    timeRemainingWarning: playback.timeRemainingWarning.default,
    timeRemainingSeconds: playback.timeRemainingSeconds.default,
    autoExitFsOnWarning:  playback.autoExitFsOnWarning.default,
  },
  list: {
    realtimeTrackSearch:   list.realtimeTrackSearch.default,
    searchLocalTracks:     list.searchLocalTracks.default,
    maxTrackSearchResults: list.maxTrackSearchResults.default,
    queryAllTrackArtists:  list.queryAllTrackArtists.default,
    queryAllTrackChannels: list.queryAllTrackChannels.default,
    moveTrackOnPlayNext:   list.moveTrackOnPlayNext.default,
    showUpNextModal:       list.showUpNextModal.default,
    showLoadMoreTracks:    list.showLoadMoreTracks.default,
    tracksPerPage:         list.tracksPerPage.default,
    enableLocalPlayback:   list.enableLocalPlayback.default,
    sortLocalTracks:       list.sortLocalTracks.default,
    warnOnPageChange:      list.warnOnPageChange.default,
  },
  gallery: {
    layout:                  gallery.layout.default,
    fetchSingleTracks:       gallery.fetchSingleTracks.default,
    tracksPerPage:           gallery.tracksPerPage.default,
    autoCrossfade:           gallery.autoCrossfade.default,
    autoCrossfadeLength:     gallery.autoCrossfadeLength.default,
    autoCrossfadeCurve:      gallery.autoCrossfadeCurve.default,
    autoScroll:              gallery.autoScroll.default,
    animateNowPlayingIcon:   gallery.animateNowPlayingIcon.default,
    trackCrossfadeDefPreset: gallery.trackCrossfadeDefPreset.default,
  },
  mobile: {
    keepScreenOn:        mobile.keepScreenOn.default,
    showTrackThumbnail:  mobile.showTrackThumbnail.default,
    showTrackTimes:      mobile.showTrackTimes.default,
    showPrevTrackButton: mobile.showPrevTrackButton.default,
  },
  site: {
    keyboardShortcuts:   site.keyboardShortcuts.default,
    theme:               site.theme.default,
    smoothScrolling:     site.smoothScrolling.default,
    overlayOpacity:      site.overlayOpacity.default,
    snackbarMessageLog:  site.snackbarMessageLog.default,
  },
  internal: {
  //showSiteInfoOnLoad: internal.showSiteInfoOnLoad.default,
  },
  experimental: {
  //enableLocalPlayback:  experimental.enableLocalPlayback.default,
  //enableDjPlayer:       experimental.enableDjPlayer.default,
  //realtimeTrackSearch:  experimental.realtimeTrackSearch.default,
  //fetchNextSingleTrack: experimental.fetchNextSingleTrack.default,
  },
};

export const settingsDescriptions = {
  playback: {
    pauseOnPlayerChange: "Pause all ultrafunk.com playback in other browser tabs and windows when starting track playback in a new player.",
  },
  list: {
    sortLocalTracks: "All locally added (device) tracks will be sorted in numerical (0 => 9) and/or alphabetical ascending order (A => Z) based on their file names.",
  },
  site: {
    snackbarMessageLog: "The 15 last snackbar (toast) messages shown on ultrafunk.com are stored with a timestamp and can be viewed by pressing <b>v</b>.",
  }
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

const crossfade = presetsSchema.crossfade;

export const presetList = {
  version: presetsSchema.version.default,
  crossfade: [
    {
      name:   crossfade[0].name.default,
      length: crossfade[0].length.default,
      curve:  crossfade[0].curve.default,
    },
    {
      name:   crossfade[1].name.default,
      length: crossfade[1].length.default,
      curve:  crossfade[1].curve.default,
    },
    {
      name:   crossfade[2].name.default,
      length: crossfade[2].length.default,
      curve:  crossfade[2].curve.default,
    },
    {
      name:   crossfade[3].name.default,
      length: crossfade[3].length.default,
      curve:  crossfade[3].curve.default,
    },
    {
      name:   crossfade[4].name.default,
      length: crossfade[4].length.default,
      curve:  crossfade[4].curve.default,
    },
    {
      name:   crossfade[5].name.default,
      length: crossfade[5].length.default,
      curve:  crossfade[5].curve.default,
    },
  ],
};
