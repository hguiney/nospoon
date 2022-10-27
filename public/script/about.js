( function about() {
  'use strict';

  /**
   * @type {HTMLAudioElement | null}
   */
  // @ts-ignore
  const $audio = document.getElementById( 'audio-monodzukuri' );
  const $playButton = document.querySelector( '[aria-controls="audio-monodzukuri"]' );

  $playButton?.addEventListener( 'click', async () => {
    try {
      await $audio?.play();
    } catch ( error ) {
      console.error( error );
    }
  } );
}() );
