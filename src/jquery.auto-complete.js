/*
 * Auto Complete [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 
(function( jQuery, window, undefined ) {

	// Expose autoComplete to the jQuery chain
	jQuery.fn.autoComplete = function(){
		// Force array of arguments
		var args = Slice.call( arguments ),
			self = this, 
			first = args.shift(),
			isMethod = typeof first == 'string',
			handler, el;
		
		// Allow for passing array of arguments, or multiple arguments
		// Eg: .autoComplete('trigger', [arg1, arg2, arg3...]) or .autoComplete('trigger', arg1, arg2, arg3...)
		// Mainly to allow for .autoComplete('trigger', arguments) to work
		// Note*: Some triggers pass an array as the first param, so check against that first
		args = ( AutoComplete.arrayMethods[ first ] === TRUE && jQuery.isArray( args[0] ) && jQuery.isArray( args[0][0] ) ) || 
			( args.length === 1 && jQuery.isArray( args[0] ) ) ? 
				args[0] : args;

		// Check method against handlers that need to use triggerHandler 
		handler = isMethod && ( AutoComplete.handlerMethods[ first ] === -1 || args.length < ( AutoComplete.handlerMethods[ first ] || 0 ) ) ? 
			'triggerHandler' : 'trigger';

		return isMethod ?
			self[ handler ]( 'autoComplete.' + first, args ) :

			// Allow passing a jquery event special object {from jQuery.Event()}
			first && first.preventDefault !== undefined ? self.trigger( first, args ) :

			// Initiate the autocomplete on each element (Only takes a single argument, the options object)
			jQuery.each( self, function(){
				if ( jQuery.data( el = this, 'autoComplete' ) !== TRUE ) {
					jQuery.autoComplete( el, first );
				}
			});
	};

	// Allows for single event binding to document and forms associated with the autoComplete inputs
	// by deferring the event to the input in focus
	function setup( $input, inputIndex ) {
		if ( setup.flag !== TRUE ) {
			setup.flag = TRUE;
			rootjQuery.bind( 'click.autoComplete', function( event ) {
				AutoComplete.getFocus( TRUE ).trigger( 'autoComplete.document-click', [ event ] );
			});
		}

		var $form = $input.closest( 'form' ), formList, $el;

		// Make sure a form was found before binding to an empty object
		if ( $form.length < 1 ) {
			return $form;
		}

		// Attach the input to the parent form
		formList = jQuery.data( $form[ 0 ], 'ac-inputs' ) || {};
		formList[ inputIndex ] = TRUE;
		jQuery.data( $form[ 0 ], 'ac-inputs', formList );

		// Transfer the submit event to the input in focus
		if ( jQuery.data( $form[ 0 ], 'autoComplete' ) !== TRUE ) {
			jQuery.data( $form[ 0 ], 'autoComplete', TRUE );
			$form.bind( 'submit.autoComplete', function( event ) {
				return ( $el = AutoComplete.getFocus( TRUE ) ).length ?
					$el.triggerHandler( 'autoComplete.form-submit', [ event, this ] ) :
					TRUE;
			});
		}
	}

	// Removes the single events attached to the document and respective input form
	function teardown( $input, inputIndex ) {
		AutoComplete.remove( inputIndex );

		if ( setup.flag === TRUE && AutoComplete.length === 0 ) {
			setup.flag = FALSE;
			rootjQuery.unbind( 'click.autoComplete' );
		}

		var $form = $input.closest( 'form' ), formList, i;

		// Make sure a parent form was found
		if ( $form.length < 1 ) {
			return;
		}

		// Remove the input from the forms cache
		formList = jQuery.data( $form[ 0 ], 'ac-inputs' ) || {};
		formList[ inputIndex ] = FALSE;

		// Check to see if this was the last input attached to the form
		for ( i in formList ) {
			if ( formList.hasOwnProperty( i ) && formList[ i ] === TRUE ) {
				return;
			}
		}

		// No other inputs are attached to this form, unbind the autoComplete submit handler only
		$form.unbind( 'submit.autoComplete' );
	}

	// Default function for adding all supply items to the list
	function allSupply( event, ui ) {
		if ( ! jQuery.isArray( ui.supply ) ) {
			return [];
		}

		for ( var i = -1, l = ui.supply.length, ret = [], entry; ++i < l; ) {
			entry = ui.supply[ i ];
			entry = entry && entry.value ? entry : { value: entry };
			ret.push( entry );
		}

		return ret;
	}

	// bgiframe is needed to fix z-index problem for IE6 users.
	// For applications that don't have bgiframe plugin installed, create a useless 
	// function that doesn't break the chain
	function emptyfn(){
		return this;
	}



// Internals
var
	// Munging
	TRUE = true,
	FALSE = false,

	// Copy of the slice prototype
	Slice = Array.prototype.slice,

	// Copy document element for munging
	document = window.document,

	// Make a copy of the document element for caching
	rootjQuery = jQuery( document ),

	// Also make a copy of an empty jQuery set for fast referencing
	emptyjQuery = jQuery( ),

	// Opera and Firefox on Mac need to use the keypress event to track holding of
	// a key down and not releasing
	keyevent = window.opera || ( /macintosh/i.test( window.navigator.userAgent ) && jQuery.browser.mozilla ) ? 
		'keypress.autoComplete' : 'keydown.autoComplete',

	// Event flag that gets passed around
	ExpandoFlag = 'autoComplete_' + jQuery.expando,

	// Make a local copy of the key codes used throughout the plugin
	KEY = {
		esc: 27,
		backspace: 8,
		tab: 9,
		enter: 13,
		shift: 16,
		space: 32,
		pageup: 33,
		pagedown: 34,
		left: 37,
		up: 38,
		right: 39,
		down: 40
	},

	// Make a copy of the old autoComplete settings for version tracking
	// (when loading more than one version on a page)
	_autoComplete = jQuery.autoComplete,

	// Create a local copy of the configuration
	AutoComplete = {
		// Autocomplete Version
		version: '[VERSION]',

		// Autocomplete specific expando
		expando: ExpandoFlag,

		// Index Counter
		counter: 0,

		// Length of stack
		length: 0,

		// Storage of elements
		stack: {},

		// jQuery object versions of the storage elements
		jqStack: {},

		// Storage order of uid's
		order: [],

		// Global access to elements in use
		hasFocus: FALSE,

		// Expose the used keycodes
		keys: KEY,

		// Methods whose first argument may contain an array
		arrayMethods: {
			'button-supply': TRUE,
			'direct-supply': TRUE
		},

		// Defines the maximum number of arguments that can be passed for using
		// triggerHandler method instead of trigger. Passing -1 forces triggerHandler
		// no matter the number of arguments
		handlerMethods: {
			'option': 2
		},

		// Events triggered whenever one of the autoComplete
		// input's come into focus or blur out.
		focus: undefined,
		blur: undefined,

		// Element currently in focus
		getFocus: function( jqStack ) {
			return ! AutoComplete.order[0] ? jqStack ? emptyjQuery : undefined :
				jqStack ? AutoComplete.jqStack[ AutoComplete.order[0] ] :
				AutoComplete.stack[ AutoComplete.order[0] ];
		},

		// Element previously in focus
		getPrevious: function( jqStack ) {
			// Removing elements cause some indexs on the order stack
			// to become undefined, so loop until one is found
			for ( var i = 0, l = AutoComplete.order.length; ++i < l; ) {
				if ( AutoComplete.order[i] ) {
					return jqStack ?
						AutoComplete.jqStack[ AutoComplete.order[i] ] :
						AutoComplete.stack[ AutoComplete.order[i] ];
				}
			}

			return jqStack ? emptyjQuery : undefined;
		},

		// Removing an element from the stack
		remove: function( n ) {
			for ( var i = -1, l = AutoComplete.order.length; ++i < l; ) {
				if ( AutoComplete.order[i] === n ) {
					AutoComplete.order[i] = undefined;
				}
			}

			AutoComplete.length--;
			delete AutoComplete.stack[n];
		},

		// Returns full stack in jQuery form
		getAll: function(){
			for ( var i = -1, l = AutoComplete.counter, stack = []; ++i < l; ) {
				if ( AutoComplete.stack[i] ) {
					stack.push( AutoComplete.stack[i] );
				}
			}
			return jQuery( stack );
		},

		// Global Defaults
		defaults: {
			// Server Script Path
			ajax: 'ajax.php',
			ajaxCache: jQuery.ajaxSettings.cache,
			// Data Configuration
			dataSupply: [],
			dataFn: undefined,
			formatSupply: undefined,
			// Drop List CSS
			list: 'auto-complete-list',
			rollover: 'auto-complete-list-rollover',
			width: undefined, // Defined as inputs width when extended (can be overridden with this global/options/meta)
			striped: undefined,
			maxHeight: undefined,
			bgiframe: undefined,
			newList: FALSE,
			// Post Data
			postVar: 'value',
			postData: {},
			postFormat: undefined,
			// Limitations
			minChars: 1,
			maxItems: -1,
			maxRequests: 0,
			maxRequestsDeep: FALSE,
			requestType: 'POST',
			// Input
			onChange: undefined,
			autoFill: FALSE,
			autoFill: FALSE,
			// iii -1
			// nonInput: [ KEY.shift, KEY.left, KEY.right ],
			// iii +2
			// Unless we can include [ctrl, shift, alt, meta] why include just [shift]
			nonInput: [ KEY.left, KEY.right ],
			multiple: FALSE,
			multipleSeparator: ' ',
			// Events
			onBlur: undefined,
			onFocus: undefined,
			onHide: undefined,
			onLoad: undefined,
			onMaxRequest: undefined,
			onRollover: undefined,
			onSelect: undefined,
			onShow: undefined,
			onListFormat: undefined,
			onSubmit: undefined,
			spinner: undefined,
			preventEnterSubmit: TRUE,
			delay: 0,
			// Caching Options
			useCache: TRUE,
			cacheLimit: 50
		}
	};

// Autocomplete function
jQuery.autoComplete = function( self, options ) {
	// Start with counters as they are used within declarations
	AutoComplete.length++;
	AutoComplete.counter++;

	// Input specific vars
	var $input = jQuery( self ).attr( 'autocomplete', 'off' ), $ul,
		// Reusable variables that should never be depended on
		$el, el,
		// Data object stored on 'autoComplete' data namespace of input
		ACData = {},
		// Track every event triggered
		LastEvent = {},
		// String of current input value
		inputval = '',
		// Holds the current list
		currentList = [],
		// Place holder for all list elements
		$elems = { length: 0 },
		// Place holder for the list element in focus
		$li,
		// View and heights for scrolling
		view, ulHeight, liHeight, liPerView,
		// Hardcoded value for ul visiblity
		ulOpen = FALSE,
		// Timer for delay
		timeid,
		// Ajax requests holder
		xhr,
		// li element in focus, and its data
		liFocus = -1, liData,
		// Fast referencing for multiple selections
		separator,
		// Index of current input
		inputIndex = AutoComplete.counter,
		// Number of requests made
		requests = 0,
		// Make local copy of bgiframe plugin
		bgiframe = jQuery.fn.bgiframe || jQuery.fn.bgIframe || emptyfn,
		// Internal Per Input Cache
		cache = {
			length: 0,
			val: undefined,
			list: {}
		},

		// Merge defaults with passed options and metadata options
		settings = jQuery.extend(
			{ width: $input.outerWidth() },
			AutoComplete.defaults, 
			options || {},
			jQuery.metadata ? $input.metadata() : {}
		);

	// Bind initial data to the element
	jQuery.data( self, 'autoComplete', ACData = {
		index: inputIndex,
		hasFocus: FALSE,
		active: TRUE,
		settings: settings,
		initialSettings: jQuery.extend( TRUE, {}, settings )
	});

	// IE catches the enter key only on keypress/keyup, so add a helper
	// to track that event if needed
	if ( self.attachEvent ) {
		$input.bind( 'keypress.autoComplete', function( event ) {
			if ( ! ACData.active ) {
				return TRUE;
			}

			if ( event.keyCode === KEY.enter ) {
				var enter = TRUE;

				// See entertracking on main key(press/down) event for explanation
				if ( $li && $li.hasClass( settings.rollover ) ) {
					enter = settings.preventEnterSubmit && ulOpen ? FALSE : TRUE;
					select( event );
				}
				else if ( ulOpen ) { 
					$ul.hide( event );
				}

				return enter;
			}
		});
	}


	// Opera && firefox on Mac use keypress to track holding down of key, 
	// while everybody else uses keydown for same functionality
	$input.bind( keyevent , function( event ) {
		// If autoComplete has been disabled, prevent input events
		if ( ! ACData.active ) {
			return TRUE;
		}

		// Track last event and store code for munging
		var key = ( LastEvent = event ).keyCode, enter = FALSE;


		// Tab Key
		if ( key === KEY.tab && ulOpen ) {
			// iii +3
			if ($li && $li.hasClass( settings.rollover)) {
					autoFill( liData.value );
			}
			select( event );
		}
		// iii +3
		else if ( key === KEY.esc ) { 
			$ul.hide( event ); 
		}
		// Enter Key
		else if ( key === KEY.enter ) {
			// When tracking whether to submit the form or not, we have
			// to ensure that the user is actually selecting an element from the drop
			// down list. It no element is selected, then hide the list and track form
			// submission. If an element is selected, then track for submission first, 
			// then hide the list.
			enter = TRUE;
			if ( $li && $li.hasClass( settings.rollover ) ) {
				enter = settings.preventEnterSubmit && ulOpen ? FALSE : TRUE;
				// iii +1
				autoFill( liData.value );
				select( event );
			}
			else if ( ulOpen ) { 
				$ul.hide( event );
			}
		}
		// Up Arrow
		else if ( key === KEY.up && ulOpen ) {
			if ( liFocus > 0 ) {
				liFocus--;
				up( event );
			} else {
				liFocus = -1;
				$li = undefined;
				$input.val( inputval );
				$ul.hide( event );
			}
		}
		// Down Arrow
		else if ( key === KEY.down && ulOpen ) {
			if ( liFocus < $elems.length - 1 ) {
				liFocus++;
				down( event );
			}
		}
		// Page Up
		else if ( key === KEY.pageup && ulOpen ) {
			if ( liFocus > 0 ) {
				liFocus -= liPerView;

				if ( liFocus < 0 ) {
					liFocus = 0;
				}

				up( event );
			}
		}
		// Page Down
		else if ( key === KEY.pagedown && ulOpen ) {
			if ( liFocus < $elems.length - 1 ) {
				liFocus += liPerView;

				if ( liFocus > $elems.length - 1 ) {
					liFocus = $elems.length - 1;
				}

				down( event );
			}
		}
		// Check for non input values defined by user
		else if ( settings.nonInput && jQuery.inArray( key, settings.nonInput ) > -1 ) {
			$ul.html('').hide( event );
			enter = TRUE;
		}
		// Everything else is considered possible input, so
		// return before keyup prevention flag is set
		else {
			return TRUE;
		}

		// Prevent autoComplete keyup event's from triggering by
		// attaching a flag to the last event
		LastEvent[ 'keydown_' + ExpandoFlag ] = TRUE;
		return enter;
	})
	.bind({
		'keyup.autoComplete': function( event ) {
			// If autoComplete has been disabled or keyup prevention 
			// flag has be set, prevent input events
			if ( ! ACData.active || LastEvent[ 'keydown_' + ExpandoFlag ] ) {
				return TRUE;
			}

			// If no special operations were run on keydown,
			// allow for regular text searching
			inputval = $input.val();
			var key = ( LastEvent = event ).keyCode, val = separator ? inputval.split( separator ).pop() : inputval;

			// Still check to make sure 'enter' wasn't pressed
			if ( key != KEY.enter ) {

				// Caching key value
				cache.val = settings.onChange === undefined ? val : 
					settings.onChange.call( self, event, {
						val: val,
						key: key,
						settings: settings,
						cache: cache,
						ul: $ul
					});

				// Only send request if character length passes
				if ( cache.val.length >= settings.minChars ) {
					// iii +9
					// Prevent request call if field is highlighted
					// IE8
					if (document.selection) {
						if (document.selection.createRange().text.length != cache.val.length) {
							sendRequest( event, settings, cache, ( key === KEY.backspace || key === KEY.space ) );
						}
					}
					// Firefox 3.6.3 OSX, Opera 10 OSX, Chrome OSX
					else if (self.selectionStart > 0) {
						sendRequest( event, settings, cache, ( key === KEY.backspace || key === KEY.space ) );
					// iii +1
					}
				}
				// Remove list on backspace of small string
				else if ( key == KEY.backspace ) {
					$ul.html('').hide( event );
				}
			}
		},

		'blur.autoComplete': function( event ) {
			// If autoComplete has been disabled or the drop list
			// is still open, prevent input events
			if ( ! ACData.active || ulOpen ) {
				return TRUE;
			}

			// Only push undefined index onto order stack
			// if not already there (in-case multiple blur events occur)
			if ( AutoComplete.order[0] !== undefined ) {
				AutoComplete.order.unshift( undefined );
			}

			// Expose focus
			AutoComplete.hasFocus = FALSE;
			ACData.hasFocus = FALSE;
			liFocus = -1;
			$li = undefined;
			$ul.hide( LastEvent = event );

			// Trigger both the global and element specific blur events
			if ( AutoComplete.blur ) {
				AutoComplete.blur.call( self, event, { settings: settings, cache: cache, ul: $ul } );
			}

			if ( settings.onBlur ) {
				settings.onBlur.call( self, event, {
					val: inputval,
					settings: settings,
					cache: cache,
					ul: $ul
				});
			}
		},

		'focus.autoComplete': function( event, flag ) {
			// Prevent inner focus events if caused by autoComplete inner functionality
			// Also, because IE triggers focus AND closes the drop list before form submission,
			// keep the select flag by not reseting the last event
			if ( ! ACData.active || ( ACData.hasFocus && flag === ExpandoFlag ) || LastEvent[ 'enter_' + ExpandoFlag ] ) {
				return TRUE;
			}

			if ( inputIndex !== jQuery.data( $ul[ 0 ], 'ac-input-index' ) ) {
				$ul.html('').hide( event );
			}

			// Overwrite undefined index pushed on by the blur event
			if ( AutoComplete.order[0] === undefined ) {
				if ( AutoComplete.order[1] === inputIndex ) {
					AutoComplete.order.shift();
				} else {
					AutoComplete.order[0] = inputIndex;
				}
			}
			else if ( AutoComplete.order[0] != inputIndex && AutoComplete.order[1] != inputIndex ) {
				AutoComplete.order.unshift( inputIndex );
			}

			if ( AutoComplete.defaults.cacheLimit !== -1 && AutoComplete.order.length > AutoComplete.defaults.cacheLimit ) {
				AutoComplete.order.pop();
			}

			// Expose focus
			AutoComplete.hasFocus = TRUE;
			ACData.hasFocus = TRUE;
			LastEvent = event;

			// Trigger both the global and element specific focus events
			if ( AutoComplete.focus ) {
				AutoComplete.focus.call( self, event, { settings: settings, cache: cache, ul: $ul } );
			}

			if ( settings.onFocus ) {
				settings.onFocus.call( self, event, { settings: settings, cache: cache, ul: $ul } );
			}
		},

		/**
		 * Autocomplete Custom Methods (Extensions off autoComplete event)
		 */ 
		// Catches document click events from the global scope
		'autoComplete.document-click': function( e, event ) {
			if ( ACData.active && ulOpen &&
				// Double check the event timestamps to ensure there isn't a delayed reaction from a button
				( ! LastEvent || event.timeStamp - LastEvent.timeStamp > 200 ) && 
				// Check the target after all other checks are passed (less processing)
				jQuery( event.target ).closest( 'ul' ).data('ac-input-index' ) !== inputIndex ) {
					$ul.hide( LastEvent = event );
					$input.trigger( 'blur' );
			}
		},

		// Catches form submission ( so only one event is attached to the form )
		'autoComplete.form-submit': function( e, event, form ) {
			if ( ! ACData.active ) {
				return TRUE;
			}

			LastEvent = event;

			// Because IE triggers focus AND closes the drop list before form submission,
			// tracking enter is set on the keydown event
			return settings.preventEnterSubmit && ( ulOpen || LastEvent[ 'enter_' + ExpandoFlag ] ) ? FALSE : 
				settings.onSubmit === undefined ? TRUE : 
				settings.onSubmit.call( self, event, { form: form, settings: settings, cache: cache, ul: $ul } );
		},

		// Catch mouseovers on the drop down element
		'autoComplete.ul-mouseenter': function( e, event, li ) {
			if ( $li ) {
				$li.removeClass( settings.rollover );
			}

			$li = jQuery( li ).addClass( settings.rollover );
			liFocus = $elems.index( li );
			liData = currentList[ liFocus ];
			view = $ul.scrollTop() + ulHeight;
			LastEvent = event;

			if ( settings.onRollover ) {
				settings.onRollover.call( self, event, {
					data: liData,
					li: $li,
					settings: settings,
					cache: cache,
					ul: $ul
				});
			}
		},

		// Catch click events on the drop down
		'autoComplete.ul-click': function( e, event ) {
			// Refocus the input box and pass flag to prevent inner focus events
			$input.trigger( 'focus', [ ExpandoFlag ] );

			// Check against separator for input value
			$input.val( inputval === separator ? 
				inputval.substr( 0, inputval.length - inputval.split( separator ).pop().length ) + liData.value + separator :
				liData.value 
			);

			$ul.hide( LastEvent = event );
			autoFill();

			if ( settings.onSelect ) {
				settings.onSelect.call( self, event, {
					data: liData,
					li: $li,
					settings: settings,
					cache: cache,
					ul: $ul
				});
			}
		},

		// Allow for change of settings at any point
		'autoComplete.settings': function( event, newSettings ) {
			if ( ! ACData.active ) {
				return TRUE;
			}

			var ret, $el;
			LastEvent = event;

			// Give access to current settings and cache
			if ( jQuery.isFunction( newSettings ) ) {
				ret = newSettings.call( self, event, { settings: settings, cache: cache, ul: $ul } );

				// Allow for extending of settings/cache based off function return values
				if ( jQuery.isArray( ret ) && ret[0] !== undefined ) {
					jQuery.extend( TRUE, settings, ret[0] || settings );
					jQuery.extend( TRUE, cache, ret[1] || cache );
				}
			} else {
				jQuery.extend( TRUE, settings, newSettings || {} );
			}

			// Re-copy the bgiframe plugin in cases where it's loaded on-demand
			bgiframe = jQuery.fn.bgiframe || jQuery.fn.bgIframe || emptyfn;

			// Custom drop list modifications
			$ul = newUl();

			// Change case here so it doesn't have to be done on every request
			settings.requestType = settings.requestType.toUpperCase();

			// autoComplete 5.1 and below had inputControl as the onChange handler
			if ( settings.inputControl !== undefined && settings.onChange === undefined ) {
				settings.onChange = settings.inputControl;
			}

			// Local copy of the seperator for faster referencing
			separator = settings.multiple ? settings.multipleSeparator : undefined;

			// Just to be sure, reset the settings object into the data storage
			ACData.settings = settings;
		},

		// Clears the Cache & requests (requests can be blocked from clearing)
		'autoComplete.flush': function( event, cacheOnly ) {
			if ( ! ACData.active ) {
				return TRUE;
			}
			
			if ( ! cacheOnly ) {
				requests = 0;
			}

			cache = { length: 0, val: undefined, list: {} };
			LastEvent = event;
		},

		// External button trigger for ajax requests
		'autoComplete.button-ajax': function( event, postData, cacheName ) {
			if ( ! ACData.active ) {
				return TRUE;
			}

			if ( typeof postData == 'string' ) {
				cacheName = postData;
				postData = {};
			}

			// Save off the last event before triggering focus on the off-chance
			// it is needed by a secondary focus event
			LastEvent = event;

			// Refocus the input box, but pass flag to prevent inner focus events
			$input.trigger( 'focus', [ ExpandoFlag ] );

			// If no cache name is given, supply a non-common word
			cache.val = cacheName || 'button-ajax_' + ExpandoFlag;

			return sendRequest(
				event, 
				jQuery.extend( TRUE, {}, settings, { maxItems: -1, postData: postData || {} } ),
				cache
			);
		},

		// External button trigger for supplied data
		'autoComplete.button-supply': function( event, data, cacheName ) {
			if ( ! ACData.active ) {
				return TRUE;
			}

			if ( typeof data == 'string' ) {
				cacheName = data;
				data = undefined;
			}

			// Again, save off event before triggering focus
			LastEvent = event;

			// Refocus the input box and pass flag to prevent inner focus events
			$input.trigger( 'focus', [ ExpandoFlag ] );

			// If no cache name is given, supply a non-common word
			cache.val = cacheName || 'button-supply_' + ExpandoFlag;

			// If no data is supplied, use data in settings
			data = jQuery.isArray( data ) ? data : settings.dataSupply;

			return sendRequest(
				event,
				jQuery.extend( TRUE, {}, settings, { maxItems: -1, dataSupply: data, formatSupply: allSupply } ),
				cache
			);
		},

		// Supply list directly into the result function
		'autoComplete.direct-supply': function( event, data, cacheName ) {
			if ( ! ACData.active ) {
				return TRUE;
			}

			if ( typeof data == 'string' ) {
				cacheName = data;
				data = undefined;
			}

			// Again, save off event before triggering focus
			LastEvent = event;

			// Refocus the input box and pass flag to prevent inner focus events
			$input.trigger( 'focus', [ ExpandoFlag ] );

			// If no cache name is given, supply a non-common word
			cache.val = cacheName || 'direct-supply_' + ExpandoFlag;

			// If no data is supplied, use data in settings
			data = jQuery.isArray( data ) && data.length ? data : settings.dataSupply;

			// Load the results directly into the results function bypassing request holdups
			return loadResults(
				event,
				data,
				jQuery.extend( TRUE, {}, settings, { maxItems: -1, dataSupply: data, formatSupply: allSupply } ),
				cache
			);
		},

		// Triggering autocomplete programatically
		'autoComplete.search': function( event, value ) {
			if ( ! ACData.active ) {
				return TRUE;
			}

			cache.val = value || '';
			return sendRequest( LastEvent = event, settings, cache );
		},

		// Add jquery-ui like option access
		'autoComplete.option': function( event, name, value ) {
			if ( ! ACData.active ) {
				return TRUE;
			}

			LastEvent = event;
			switch ( Slice.call( arguments ).length ) {
				case 3: 
					settings[ name ] = value;
					return value;
				case 2:
					return name === 'ul' ? $ul :
						name === 'cache' ? cache :
						name === 'xhr' ? xhr :
						name === 'input' ? $input :
						settings[ name ] || undefined;
				default:
					return settings;
			}
		},

		// Add enabling event (only applicable after disable)
		'autoComplete.enable': function( event ) {
			ACData.active = TRUE;
			LastEvent = event;
		},

		// Add disable event
		'autoComplete.disable': function( event ) {
			ACData.active = FALSE;
			$ul.html('').hide( LastEvent = event );
		},

		// Add a destruction function
		'autoComplete.destroy': function( event ) {
			var list = jQuery.data( $ul.html('').hide( LastEvent = event )[ 0 ], 'ac-inputs' ) || {}, i;

			// Remove all autoComplete specific data and events
			$input.removeData( 'autoComplete' ).unbind( '.autoComplete autoComplete' );

			// Remove form/drop list/document event catchers if possible
			teardown( $input, inputIndex );

			// Remove input from the drop down element of inputs
			list[ inputIndex ] = undefined;

			// Go through the drop down element and see if any other inputs are attached to it
			for ( i in list ) {
				if ( list.hasOwnProperty( i ) && list[ i ] === TRUE ) {
					return LastEvent;
				}
			}

			// Remove the element from the DOM if self created
			if ( jQuery.data( $ul[ 0 ], 'ac-selfmade' ) === TRUE ) {
				$ul.remove();
			}
			// Kill all data associated with autoComplete for a cleaned drop down element
			else {
				$ul.removeData( 'autoComplete' ).removeData( 'ac-input-index' ).removeData( 'ac-inputs' );
			}
		}
	});

	// Ajax/Cache Request
	function sendRequest( event, settings, cache, backSpace, timeout ) {
		// Merely setting max requests still allows usage of cache and supplied data,
		// this 'Deep' option prevents those scenarios if needed
		if ( settings.maxRequestsDeep === TRUE && requests >= settings.maxRequests ) {
			return FALSE;
		}

		if ( settings.spinner ) {
			settings.spinner.call( self, event, { active: TRUE, settings: settings, cache: cache, ul: $ul } );
		}

		if ( timeid ) {
			timeid = clearTimeout( timeid );
		}

		// Call send request again with timeout flag if on delay
		if ( settings.delay > 0 && timeout === undefined ) {
			timeid = window.setTimeout(function(){
				sendRequest( event, settings, cache, backSpace, TRUE );
			}, settings.delay );
			return timeid;
		}

		// Abort previous request incase it's still running
		if ( xhr ) {
			xhr.abort();
		}

		// Load from cache if possible
		if ( settings.useCache && jQuery.isArray( cache.list[ cache.val ] ) ) {
			return loadResults( event, cache.list[ cache.val ], settings, cache, backSpace );
		}

		// Use user supplied data when defined
		if ( settings.dataSupply.length ) {
			return userSuppliedData( event, settings, cache, backSpace );
		}

		// Check Max requests first before sending request
		if ( settings.maxRequests && ++requests >= settings.maxRequests ) {
			$ul.html('').hide( event );

			if ( settings.spinner ) {
				settings.spinner.call( self, event, { active: FALSE, settings: settings, cache: cache, ul: $ul } );
			}

			if ( settings.onMaxRequest && requests === settings.maxRequests ) {
				return settings.onMaxRequest.call( self, event, {
					search: cache.val,
					val: inputval,
					settings: settings,
					cache: cache,
					ul: $ul
				});
			}
			
			return FALSE;
		}

		settings.postData[ settings.postVar ] = cache.val;
		xhr = jQuery.ajax({
			type: settings.requestType,
			url: settings.ajax,
			cache: settings.ajaxCache,
			dataType: 'json',

			// Send personalised data
			data: settings.postFormat ?
				settings.postFormat.call( self, event, {
					data: settings.postData,
					search: cache.val,
					val: inputval,
					settings: settings,
					cache: cache,
					ul: $ul
				}) :
				settings.postData,

			success: function( list ) {
				loadResults( event, list, settings, cache, backSpace );
			},

			error: function() {
				$ul.html('').hide( event );
				if ( settings.spinner ) {
					settings.spinner.call( self, event, { active: FALSE, settings: settings, cache: cache, ul: $ul } );
				}
			}
		});

		return xhr;
	}

	// Parse User Supplied Data
	function userSuppliedData( event, settings, cache, backSpace ) {
		var list = [], ui = {},
			fn = jQuery.isFunction( settings.dataFn ),
			regex = fn ? undefined : new RegExp( '^'+cache.val, 'i' ),
			items = 0, entry, i = -1, l = settings.dataSupply.length;

		if ( settings.formatSupply ) {
			list = settings.formatSupply.call( self, event, {
				search: cache.val,
				supply: settings.dataSupply,
				settings: settings,
				cache: cache,
				ul: $ul
			});
		} else {
			for ( ; ++i < l ; ) {
				// Force object wrapper for entry
				entry = settings.dataSupply[i];
				entry = entry && typeof entry.value == 'string' ? entry : { value: entry };

				// Setup ui object for dataFn
				ui = {
					search: cache.val,
					entry: entry.value,
					list: list,
					i: i,
					supply: settings.dataSupply,
					settings: settings,
					cache: cache,
					ul: $ul
				};

				// If user supplied function, use that, otherwise test with default regex
				if ( ( fn && settings.dataFn.call( self, event, ui ) ) || ( ! fn && entry.value.match( regex ) ) ) {
					// Reduce browser load by breaking on limit if it exists
					if ( settings.maxItems > -1 && ++items > settings.maxItems ) {
						break;
					}
					list.push( entry );
				}
			}
		}

		// Use normal load functionality
		return loadResults( event, list, settings, cache, backSpace );
	}

	// Key element Selection
	function select( event ) {
		// Ensure the select function only gets fired when list of open
		if ( ulOpen ) {
			if ( settings.onSelect ) {
				settings.onSelect.call( self, event, {
					data: liData,
					li: $li,
					settings: settings,
					cache: cache,
					ul: $ul
				});
			}

			autoFill();
			inputval = $input.val();

			// Because IE triggers focus AND closes the drop list before form submission
			// attach a flag on 'enter' selection
			if ( LastEvent.type === 'keydown' ) {
				LastEvent[ 'enter_' + ExpandoFlag ] = TRUE;
			}

			$ul.hide( event );
		}

		$li = undefined;
	}

	// Key direction up
	function up( event ) {
		if ( $li ) {
			$li.removeClass( settings.rollover );
		}

		$ul.show( event );
		$li = $elems.eq( liFocus ).addClass( settings.rollover );
		liData = currentList[ liFocus ];

		if ( ! $li.length || ! liData ) {
			return FALSE;
		}

		autoFill( liData.value );
		if ( settings.onRollover ) {
			settings.onRollover.call( self, event, {
				data: liData,
				li: $li,
				settings: settings,
				cache: cache,
				ul: $ul
			});
		}

		// Scrolling
		var scroll = liFocus * liHeight;
		if ( scroll < view - ulHeight ) {
			view = scroll + ulHeight;
			$ul.scrollTop( scroll );
		}
	}

	// Key direction down
	function down( event ) {
		if ( $li ) {
			$li.removeClass( settings.rollover );
		}

		$ul.show( event );
		$li = $elems.eq( liFocus ).addClass( settings.rollover );
		liData = currentList[ liFocus ];

		if ( ! $li.length || ! liData ) {
			return FALSE;
		}

		autoFill( liData.value );

		// Scrolling
		var scroll = ( liFocus + 1 ) * liHeight;
		if ( scroll > view ) {
			$ul.scrollTop( ( view = scroll ) - ulHeight );
		}

		if ( settings.onRollover ) {
			settings.onRollover.call( self, event, {
				data: liData,
				li: $li,
				settings: settings,
				cache: cache,
				ul: $ul
			});
		}
	}

	// Attach new show/hide functionality to only the ul object (so not to infect all of jQuery),
	// And also attach event handlers if not already done so
	function newUl() {
		// Allow for passing elements as the list propery for more control
		if ( ! settings.newList && ! $ul ) {
			$ul = settings.list.jquery ? settings.list:
				settings.list.nodeName ? jQuery( settings.list ) :
				typeof settings.list == 'string' && ( $el = rootjQuery.find( 'ul.' + settings.list ).eq( 0 ) ).length ?
					bgiframe.call( $el, settings.bgiframe ) :
				undefined;
		}

		// Create the list element since it does not exist based on the checks above
		if ( ! $ul ) {
			$ul = bgiframe.call(
				jQuery('<ul/>').appendTo('body').addClass( settings.list ).hide().data( 'ac-selfmade', TRUE ),
				settings.bgiframe
			);
		}

		// Storage for monkey patching
		var hide = $ul.hide, show = $ul.show, list = jQuery.data( $ul[ 0 ], 'ac-inputs' ) || {};

		// Monkey patch the list object to control the hiding and showing
		if ( ! $ul[ ExpandoFlag ] ) {
			$ul.hide = function( event, speed, callback ) {
				if ( settings.onHide && ulOpen ) {
					settings.onHide.call( self, event, { ul: $ul, settings: settings, cache: cache } );
				}

				ulOpen = FALSE;
				return hide.call( $ul, speed, callback );
			};

			$ul.show = function( event, speed, callback ) {
				if ( settings.onShow && ! ulOpen ) {
					settings.onShow.call( self, event, { ul: $ul, settings: settings, cache: cache } );
				}

				ulOpen = TRUE;
				return show.call( $ul, speed, callback );
			};

			// A flag must be attached to the $ul cached object
			$ul[ ExpandoFlag ] = TRUE;
		}

		// Attach global handlers for event delegation (So there is no more loss time in unbinding and rebinding)
		if ( jQuery.data( $ul[ 0 ], 'autoComplete' ) !== TRUE ) {
			jQuery.data( $ul[ 0 ], 'autoComplete', TRUE );
			$ul.delegate( 'li', 'mouseenter.autoComplete', function( event ) {
				AutoComplete.getFocus( TRUE ).trigger( 'autoComplete.ul-mouseenter', [ event, this ] );
			})
			.bind( 'click.autoComplete', function( event ) {
				AutoComplete.getFocus( TRUE ).trigger( 'autoComplete.ul-click', [ event ] );
				return FALSE;
			});
		}

		list[ inputIndex ] = TRUE;
		jQuery.data( $ul[ 0 ], 'ac-inputs', list );
		return $ul;
	}

	// Auto-fill the input
	// Credit to Jörn Zaefferer @ http://bassistance.de/jquery-plugins/jquery-plugin-autocomplete/
	// and http://www.pengoworks.com/workshop/jquery/autocomplete.htm for this functionality
	function autoFill( val ) {
		var start, end, range;

		// Set starting and ending points based on values
		if ( val === undefined || val === '' ) {
			start = end = $input.val().length;
		} else {
			if ( separator ) {
				val = inputval.substr( 0, inputval.length - inputval.split( separator ).pop().length ) + val + separator;
			}

			start = inputval.length;
			end = val.length;
			$input.val( val );
		}

		// Create selection if allowed
		if ( ! settings.autoFill || start > end ) {
			return FALSE;
		}
		else if ( self.createTextRange ) {
			range = self.createTextRange();
			if ( val === undefined ) {
				range.move( 'character', start );
				range.select();
			} else {
				range.collapse( TRUE );
				range.moveStart( 'character', start );
				range.moveEnd( 'character', end );
				range.select();
			}
		}
		else if ( self.setSelectionRange ) {
			self.setSelectionRange( start, end );
		}
		else if ( self.selectionStart ) {
			self.selectionStart = start;
			self.selectionEnd = end;
		}
	}

	// List Functionality
	function loadResults( event, list, settings, cache, backSpace ) {
		// Allow another level of result handling
		currentList = settings.onLoad ?
			settings.onLoad.call( self, event, { list: list, settings: settings, cache: cache, ul: $ul } ) : list;

		// Tell spinner function to stop if set
		if ( settings.spinner ) {
			settings.spinner.call( self, event, { active: FALSE, settings: settings, cache: cache, ul: $ul } );
		}

		// Store results into the cache if allowed
		if ( settings.useCache && ! jQuery.isArray( cache.list[ cache.val ] ) ) {
			cache.length++;
			cache.list[ cache.val ] = list;

			// Clear cache if necessary
			if ( settings.cacheLimit !== -1 && cache.length > settings.cacheLimit ) {
				cache.list = {};
				cache.length = 0;
			}
		}

		// Ensure there is a list
		if ( ! currentList || currentList.length < 1 ) {
			return $ul.html('').hide( event );
		}

		// Refocus list element
		liFocus = -1;
		$li = undefined;

		// Initialize Vars together (save bytes)
		var offset = $input.offset(), // Input position
			container = [], // Container for list elements
			items = 0, i = -1, striped = FALSE, length = currentList.length; // Loop Items

		if ( settings.onListFormat ) {
			settings.onListFormat.call( self, event, { list: currentList, settings: settings, cache: cache, ul: $ul } );
		}
		else {
			// Push items onto container
			for ( ; ++i < length; ) {
				if ( currentList[i].value ) {
					if ( settings.maxItems > -1 && ++items > settings.maxItems ) {
						break;
					}

					container.push(
						settings.striped && striped ? '<li class="' + settings.striped + '">' : '<li>',
						currentList[i].display || currentList[i].value,
						'</li>'
					);

					striped = ! striped;
				}
			}
			$ul.html( container.join('') );
		}

		// Cache the list items and give focus to the drop list
		$elems = $ul.children( 'li' );
		jQuery.data( $ul[ 0 ], 'ac-input-index', inputIndex );

		// Autofill input with first entry
		if ( settings.autoFill && ! backSpace ) {
			liFocus = 0;
			liData = currentList[ 0 ];
			autoFill( liData.value );
			$li = $elems.eq( 0 ).addClass( settings.rollover );
		}

		// Align the drop down element
		$ul.scrollTop( 0 ).css({
			top: offset.top + $input.outerHeight(),
			left: offset.left,
			width: settings.width
		})
		// The drop list has to be shown before maxHeight can be configured
		.show( event );

		// Log li height for less computation
		liHeight = $elems.eq( 0 ).outerHeight();

		// If Max Height specified, control it
		if ( settings.maxHeight ) {
			$ul.css({
				height: liHeight * $elems.length > settings.maxHeight ? settings.maxHeight : 'auto', 
				overflow: 'auto'
			});
		}

		// ulHeight gets manipulated, so assign to viewport seperately 
		// so referencing conflicts don't override viewport
		ulHeight = $ul.outerHeight();
		view = ulHeight;

		// Number of elements per viewport
		liPerView = liHeight === 0 ? 0 : Math.floor( view / liHeight );

		// Include amount of time it took to load the list
		// and run modifications
		LastEvent.timeStamp = ( new Date() ).getTime();
	}

	// Custom modifications to the drop down element
	$ul = newUl();

	// Do case change on initialization so it's not run on every request
	settings.requestType = settings.requestType.toUpperCase();

	// autoComplete 5.1 and below had inputControl as the onChange handler
	if ( settings.inputControl !== undefined && settings.onChange === undefined ) {
		settings.onChange = settings.inputControl;
	}

	// Local quick copy of the seperator (so we don't have to run this check every time)
	separator = settings.multiple ? settings.multipleSeparator : undefined;

	// Expose copies of both the input element and the cached jQuery version
	AutoComplete.stack[ inputIndex ] = self;
	AutoComplete.jqStack[ inputIndex ] = $input;

	// Form and Document event attachment
	setup( $input, inputIndex );
};

// Extend the autoComplete configuration onto the base autoComplete function
AutoComplete = jQuery.extend( jQuery.autoComplete, AutoComplete );

})( jQuery, this );
