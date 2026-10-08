/**
 * Mobapp Tech — front-end motion.
 * Vanilla JS, no dependencies. Every effect degrades to static content when
 * JS is off or the visitor prefers reduced motion.
 */
( () => {
	const root = document.documentElement;
	const reduced = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	const finePointer = window.matchMedia( '(hover: hover) and (pointer: fine)' ).matches;

	const $ = ( sel, ctx = document ) => ctx.querySelector( sel );
	const $$ = ( sel, ctx = document ) => Array.from( ctx.querySelectorAll( sel ) );
	const clamp = ( v, min = 0, max = 1 ) => Math.min( max, Math.max( min, v ) );
	const wait = ( ms ) => new Promise( ( r ) => setTimeout( r, ms ) );

	root.classList.add( 'js' );

	/* Wrap every word in a span (keeping inline tags like <em>) so words can animate individually. */
	function splitWords( el ) {
		let index = 0;
		const walk = ( node ) => {
			Array.from( node.childNodes ).forEach( ( child ) => {
				if ( child.nodeType === Node.TEXT_NODE ) {
					const frag = document.createDocumentFragment();
					child.textContent.split( /(\s+)/ ).forEach( ( part ) => {
						if ( ! part ) {
							return;
						}
						if ( /^\s+$/.test( part ) ) {
							frag.appendChild( document.createTextNode( part ) );
							return;
						}
						const w = document.createElement( 'span' );
						w.className = 'w';
						w.textContent = part;
						w.style.setProperty( '--i', index++ );
						frag.appendChild( w );
					} );
					child.replaceWith( frag );
				} else if ( child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR' ) {
					walk( child );
				}
			} );
		};
		walk( el );
		el.classList.add( 'is-split' );
		return $$( '.w', el );
	}

	/* Site name as the logo wordmark: "mobapp" bold, "tech" lighter (styled in CSS). */
	$$( '.mt-brand .wp-block-site-title a, .mt-footer .wp-block-site-title a' ).forEach( ( link ) => {
		const words = link.textContent.trim().split( /\s+/ );
		if ( words.length > 1 && link.children.length === 0 ) {
			// One wrapper, so the link's flex gap (between mark and name) doesn't split the words.
			const name = document.createElement( 'span' );
			const tail = document.createElement( 'span' );
			tail.className = 'mt-brand__tail';
			tail.textContent = words.pop();
			name.textContent = words.join( ' ' ) + ' ';
			name.appendChild( tail );
			link.textContent = '';
			link.appendChild( name );
		}
	} );

	/* Index children for CSS stagger delays. */
	$$( '.mt-tokens, .mt-eq' ).forEach( ( parent ) => {
		Array.from( parent.children ).forEach( ( child, i ) => child.style.setProperty( '--i', i ) );
	} );

	/* ------------------------------------------------ Reveal on scroll */

	$$( '.mt-split' ).forEach( splitWords );

	// Siblings revealed together get a small cascading delay (hero has its own order in CSS).
	const siblingCount = new Map();
	$$( '.mt-reveal' ).forEach( ( el ) => {
		if ( el.closest( '.mt-hero' ) ) {
			return;
		}
		const n = siblingCount.get( el.parentElement ) || 0;
		siblingCount.set( el.parentElement, n + 1 );
		if ( n ) {
			el.style.setProperty( '--d', `${ n * 110 }ms` );
		}
	} );

	function countUp( el ) {
		const match = el.textContent.trim().match( /^(\D*)(\d[\d,]*)(.*)$/ );
		if ( ! match || reduced ) {
			return;
		}
		const [ , prefix, digits, suffix ] = match;
		const target = parseInt( digits.replace( /,/g, '' ), 10 );
		const start = performance.now();
		const duration = 1800;
		const tick = ( now ) => {
			const t = clamp( ( now - start ) / duration );
			const eased = 1 - Math.pow( 2, -10 * t );
			el.textContent = prefix + Math.round( target * ( t === 1 ? 1 : eased ) ).toLocaleString( 'en-US' ) + suffix;
			if ( t < 1 ) {
				requestAnimationFrame( tick );
			}
		};
		requestAnimationFrame( tick );
	}

	// Labels "decode" from random glyphs into their text, like a terminal.
	const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/';
	function decode( el ) {
		const target = el.textContent;
		if ( reduced || ! target.trim() ) {
			return;
		}
		const start = performance.now();
		const duration = 500 + target.length * 28;
		el.setAttribute( 'aria-label', target );
		const tick = ( now ) => {
			const p = clamp( ( now - start ) / duration );
			const settled = Math.floor( p * target.length );
			let out = '';
			for ( let i = 0; i < target.length; i++ ) {
				const ch = target[ i ];
				out += i < settled || ch === ' ' ? ch : GLYPHS[ Math.floor( Math.random() * GLYPHS.length ) ];
			}
			el.textContent = p < 1 ? out : target;
			if ( p < 1 ) {
				requestAnimationFrame( tick );
			} else {
				el.removeAttribute( 'aria-label' );
			}
		};
		requestAnimationFrame( tick );
	}

	const revealer = new IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( ! entry.isIntersecting ) {
					return;
				}
				entry.target.classList.add( 'is-in' );
				$$( '.mt-count', entry.target ).forEach( countUp );
				if ( entry.target.matches( '.mt-eyebrow, .mt-pill' ) ) {
					decode( entry.target );
				}
				revealer.unobserve( entry.target );
			} );
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
	);
	$$( '.mt-reveal, .mt-split' ).forEach( ( el ) => revealer.observe( el ) );

	/* ------------------------------------------------------ Header */

	const progressBar = document.createElement( 'div' );
	progressBar.className = 'mt-progress';
	progressBar.setAttribute( 'aria-hidden', 'true' );
	document.body.appendChild( progressBar );

	let lastY = window.scrollY;
	function updateHeader() {
		const y = window.scrollY;
		const menuOpen = $( '.wp-block-navigation__responsive-container.is-menu-open' );
		root.classList.toggle( 'is-scrolled', y > 10 );
		if ( ! menuOpen && y > 400 && y > lastY + 4 ) {
			root.classList.add( 'is-header-hidden' );
		} else if ( y < lastY - 4 || y <= 400 ) {
			root.classList.remove( 'is-header-hidden' );
		}
		lastY = y;

		const max = document.documentElement.scrollHeight - window.innerHeight;
		progressBar.style.setProperty( '--sp', max > 0 ? ( y / max ).toFixed( 4 ) : 0 );
	}

	// Close the mobile overlay when one of its in-page links is used.
	document.addEventListener( 'click', ( e ) => {
		const link = e.target.closest( '.wp-block-navigation__responsive-container.is-menu-open a[href*="#"]' );
		if ( link ) {
			$( '.wp-block-navigation__responsive-container-close' )?.click();
		}
	} );

	/* -------------------------------------------------------- Hero */

	const hero = $( '.mt-hero' );
	const stage = $( '.mt-hero__stage' );

	function updateHero() {
		if ( ! hero || ! stage ) {
			return;
		}
		const p = clamp( window.scrollY / ( hero.offsetHeight * 0.55 ) );
		stage.style.setProperty( '--p', p.toFixed( 3 ) );
	}

	if ( hero && stage && finePointer && ! reduced ) {
		hero.addEventListener( 'pointermove', ( e ) => {
			const r = hero.getBoundingClientRect();
			const x = ( e.clientX - r.left ) / r.width;
			const y = ( e.clientY - r.top ) / r.height;
			stage.style.setProperty( '--mx', ( x * 2 - 1 ).toFixed( 3 ) );
			stage.style.setProperty( '--my', ( y * 2 - 1 ).toFixed( 3 ) );
			hero.style.setProperty( '--gx', `${ e.clientX - r.left }px` );
			hero.style.setProperty( '--gy', `${ e.clientY - r.top }px` );
		} );
		hero.addEventListener( 'pointerleave', () => {
			stage.style.setProperty( '--mx', 0 );
			stage.style.setProperty( '--my', 0 );
		} );
	}

	/* ----------------------------- Hero phone: live demo of our apps */

	// Returns a function that resolves once `el` is on screen and the tab is visible.
	function visibilityGate( el ) {
		let visible = false;
		new IntersectionObserver( ( [ entry ] ) => {
			visible = entry.isIntersecting;
		} ).observe( el );
		return () =>
			new Promise( ( resolve ) => {
				const check = () => ( visible && ! document.hidden ? resolve() : setTimeout( check, 300 ) );
				check();
			} );
	}

	// Returns a function that plays the scripted chat once, typing like a live AI reply.
	function chatPlayer( el, whenVisible ) {
		const script = $$( '.mt-msg', el ).map( ( m ) => ( {
			me: m.classList.contains( 'mt-msg--me' ),
			text: m.textContent.trim(),
		} ) );
		const add = ( className, text = '' ) => {
			const node = document.createElement( 'div' );
			node.className = className;
			node.textContent = text;
			el.appendChild( node );
			return node;
		};

		return async () => {
			el.textContent = '';
			for ( const msg of script ) {
				await whenVisible();
				if ( msg.me ) {
					await wait( 800 );
					add( 'mt-msg mt-msg--me is-new', msg.text );
					await wait( 400 );
				} else {
					const typing = add( 'mt-typing' );
					typing.innerHTML = '<i></i><i></i><i></i>';
					await wait( 1300 );
					typing.remove();
					const bubble = add( 'mt-msg mt-msg--ai is-new' );
					const words = msg.text.split( ' ' );
					for ( let i = 1; i <= words.length; i++ ) {
						bubble.textContent = words.slice( 0, i ).join( ' ' );
						await wait( 55 );
					}
					await wait( 700 );
				}
			}
			await wait( 2500 );
		};
	}

	// Cycles the hero phone through its app screens: the Sem AI chat plays once, the others dwell.
	function heroDemo( phone ) {
		const screens = $$( '.mt-screen', phone );
		const chat = $( '[data-chat]', phone );
		const whenVisible = visibilityGate( phone );
		const playChat = chat ? chatPlayer( chat, whenVisible ) : null;

		// Counts on-screen time only, so a hidden hero doesn't skip ahead.
		const dwell = async ( ms ) => {
			for ( let elapsed = 0; elapsed < ms; elapsed += 250 ) {
				await whenVisible();
				await wait( 250 );
			}
		};

		( async () => {
			for ( ;; ) {
				for ( const screen of screens.length ? screens : [ phone ] ) {
					await whenVisible();
					const hasChat = playChat && screen.contains( chat );
					if ( hasChat ) {
						chat.textContent = '';
					}
					screens.forEach( ( s ) => s.classList.toggle( 'is-active', s === screen ) );
					$$( '.mt-count', screen ).forEach( countUp );
					await ( hasChat ? playChat() : dwell( 5500 ) );
				}
			}
		} )();
	}

	if ( ! reduced ) {
		$$( '.mt-hero .mt-phone__screen' ).forEach( heroDemo );
	}

	/* ------------------------------------------- Pointer effects */

	if ( finePointer && ! reduced ) {
		// Spotlight cards.
		$$( '.mt-spot' ).forEach( ( card ) => {
			card.addEventListener( 'pointermove', ( e ) => {
				const r = card.getBoundingClientRect();
				card.style.setProperty( '--x', `${ e.clientX - r.left }px` );
				card.style.setProperty( '--y', `${ e.clientY - r.top }px` );
			} );
		} );

		// Magnetic buttons.
		$$( '.mt-magnetic .wp-block-button__link' ).forEach( ( btn ) => {
			btn.addEventListener( 'pointermove', ( e ) => {
				const r = btn.getBoundingClientRect();
				btn.style.setProperty( '--tx', `${ ( e.clientX - r.left - r.width / 2 ) * 0.3 }px` );
				btn.style.setProperty( '--ty', `${ ( e.clientY - r.top - r.height / 2 ) * 0.4 }px` );
			} );
			btn.addEventListener( 'pointerleave', () => {
				btn.style.setProperty( '--tx', '0px' );
				btn.style.setProperty( '--ty', '0px' );
			} );
		} );

		// 3D tilt follows the pointer across the device stage.
		$$( '.mt-tilt' ).forEach( ( el ) => {
			const area = el.closest( '.mt-app__stage' ) || el.parentElement;
			area.addEventListener( 'pointermove', ( e ) => {
				const r = area.getBoundingClientRect();
				const x = ( e.clientX - r.left ) / r.width - 0.5;
				const y = ( e.clientY - r.top ) / r.height - 0.5;
				el.style.setProperty( '--ry', `${ x * 22 }deg` );
				el.style.setProperty( '--rx', `${ y * -14 }deg` );
			} );
			area.addEventListener( 'pointerleave', () => {
				el.style.removeProperty( '--ry' );
				el.style.removeProperty( '--rx' );
			} );
		} );
	}

	/* ---------------------------------- Pinned horizontal process */

	const proc = $( '.mt-process' );
	const track = proc && $( '.mt-process__track', proc );
	const steps = track ? Array.from( track.children ) : [];
	const procBar = proc && $( '.mt-process__bar', proc );
	let pinned = false;
	let maxShift = 0;

	function measurePin() {
		if ( ! proc || ! track || ! steps.length ) {
			return;
		}
		pinned = ! reduced && window.innerWidth >= 900 && window.innerHeight >= 640;
		proc.classList.toggle( 'is-pinned', pinned );
		if ( ! pinned ) {
			proc.style.removeProperty( '--pin-h' );
			track.style.removeProperty( '--shift' );
			return;
		}
		const last = steps[ steps.length - 1 ];
		const pad = parseFloat( getComputedStyle( track ).paddingLeft ) || 0;
		maxShift = Math.max( 0, last.offsetLeft + last.offsetWidth + pad - track.clientWidth );
		proc.style.setProperty( '--pin-h', `${ maxShift + window.innerHeight }px` );
	}

	function setProcessProgress( p ) {
		procBar?.style.setProperty( '--pp', p.toFixed( 4 ) );
		steps.forEach( ( step, i ) => {
			step.classList.toggle( 'is-active', p >= ( i / Math.max( 1, steps.length - 1 ) ) * 0.94 );
		} );
	}

	function updatePin() {
		if ( ! pinned ) {
			return;
		}
		const total = proc.offsetHeight - window.innerHeight;
		const p = total > 0 ? clamp( -proc.getBoundingClientRect().top / total ) : 0;
		track.style.setProperty( '--shift', ( p * maxShift ).toFixed( 1 ) );
		setProcessProgress( p );
	}

	// Touch / narrow screens: the track is a native swipe carousel.
	track?.addEventListener(
		'scroll',
		() => {
			if ( pinned ) {
				return;
			}
			const max = track.scrollWidth - track.clientWidth;
			setProcessProgress( max > 0 ? track.scrollLeft / max : 1 );
		},
		{ passive: true }
	);

	/* ----------------------- App showcase: sticky device, scrolling copy */

	const showcase = $( '.mt-showcase' );
	const showcaseApps = showcase ? $$( ':scope > .mt-app', showcase ) : [];
	const railButtons = [];
	let showcaseOn = false;
	let activeApp = -1;

	function setActiveApp( index ) {
		activeApp = index;
		showcaseApps.forEach( ( app, i ) => app.classList.toggle( 'is-active', i === index ) );
		railButtons.forEach( ( button, i ) => button.setAttribute( 'aria-current', String( i === index ) ) );

		const app = showcaseApps[ index ];
		// The card has no box of its own here, so the reveal observer never fires for it.
		if ( ! app.classList.contains( 'is-in' ) ) {
			app.classList.add( 'is-in' );
			$$( '.mt-count', app ).forEach( countUp );
		}
		showcase.style.setProperty( '--tint', getComputedStyle( app ).getPropertyValue( '--app-tint' ).trim() );
	}

	function updateShowcase() {
		if ( ! showcaseOn ) {
			return;
		}
		const middle = window.innerHeight / 2;
		let closest = 0;
		let closestDistance = Infinity;
		showcaseApps.forEach( ( app, i ) => {
			const r = $( '.mt-app__copy', app ).getBoundingClientRect();
			const distance = Math.abs( r.top + r.height / 2 - middle );
			if ( distance < closestDistance ) {
				closestDistance = distance;
				closest = i;
			}
		} );
		if ( closest !== activeApp ) {
			setActiveApp( closest );
		}
	}

	function measureShowcase() {
		if ( showcaseApps.length < 2 ) {
			return;
		}
		showcaseOn = ! reduced && window.innerWidth >= 960 && window.innerHeight >= 800;
		showcase.classList.toggle( 'is-showcase', showcaseOn );
		if ( showcaseOn ) {
			activeApp = -1;
			updateShowcase();
		} else {
			showcaseApps.forEach( ( app ) => app.classList.remove( 'is-active' ) );
		}
	}

	if ( showcaseApps.length >= 2 ) {
		// Appended (not prepended) so the cards keep their :nth-of-type positions.
		const backdrop = document.createElement( 'div' );
		backdrop.className = 'mt-showcase__backdrop';
		backdrop.innerHTML = '<div class="mt-showcase__glow" aria-hidden="true"></div>';
		const rail = document.createElement( 'nav' );
		rail.className = 'mt-showcase__rail';
		rail.setAttribute( 'aria-label', 'Our apps' );
		showcaseApps.forEach( ( app ) => {
			const button = document.createElement( 'button' );
			button.type = 'button';
			button.textContent = $( '.mt-app__name', app )?.textContent.trim() || '';
			button.addEventListener( 'click', () => {
				$( '.mt-app__copy', app ).scrollIntoView( { behavior: reduced ? 'auto' : 'smooth', block: 'center' } );
			} );
			railButtons.push( button );
			rail.appendChild( button );
		} );
		backdrop.appendChild( rail );
		showcase.appendChild( backdrop );
	}

	/* --------------------------- Globe: rotating dots, arcs between cities */

	// Real coordinates [lat, lon]; Istanbul is home, so most arcs start there.
	const CITIES = [
		[ 41.01, 28.98 ], [ 40.71, -74.01 ], [ 37.77, -122.42 ], [ 19.43, -99.13 ], [ -23.55, -46.63 ],
		[ 51.51, -0.13 ], [ 48.86, 2.35 ], [ 52.52, 13.4 ], [ 25.2, 55.27 ], [ 19.08, 72.88 ],
		[ 1.35, 103.82 ], [ 35.68, 139.69 ], [ 37.57, 126.98 ], [ -33.87, 151.21 ], [ 6.52, 3.38 ],
		[ 30.04, 31.24 ], [ -26.2, 28.05 ], [ -6.21, 106.85 ], [ 43.65, -79.38 ], [ -34.6, -58.38 ],
		[ 24.71, 46.68 ], [ 55.76, 37.62 ],
	].map( ( [ lat, lon ] ) => toVector( lat, lon ) );

	function toVector( lat, lon ) {
		const phi = ( lat * Math.PI ) / 180;
		const lambda = ( lon * Math.PI ) / 180;
		return [ Math.cos( phi ) * Math.sin( lambda ), Math.sin( phi ), Math.cos( phi ) * Math.cos( lambda ) ];
	}

	function globe( host ) {
		const canvas = document.createElement( 'canvas' );
		canvas.className = 'mt-globe__canvas';
		canvas.setAttribute( 'aria-hidden', 'true' );
		host.appendChild( canvas );
		host.classList.add( 'has-canvas' );
		const ctx = canvas.getContext( '2d' );

		// Evenly spread dots (Fibonacci sphere).
		const dots = [];
		const count = 1100;
		for ( let i = 0; i < count; i++ ) {
			const y = 1 - ( 2 * ( i + 0.5 ) ) / count;
			const r = Math.sqrt( 1 - y * y );
			const a = i * Math.PI * ( 3 - Math.sqrt( 5 ) );
			dots.push( [ r * Math.sin( a ), y, r * Math.cos( a ) ] );
		}

		let size = 0;
		let dpr = 1;
		let spin = 0.6;
		let tilt = 0.45; // north towards the viewer, where most of the cities are
		let velocity = 0;
		let dragging = null;
		let visible = false;
		let running = false;
		let last = performance.now();
		const arcs = [];
		let nextArc = 0;

		const resize = () => {
			dpr = Math.min( window.devicePixelRatio || 1, 2 );
			size = canvas.clientWidth;
			canvas.width = size * dpr;
			canvas.height = size * dpr;
		};

		// Rotate around Y (spin) then X (tilt); returns [screenX, screenY, depth].
		const project = ( [ x, y, z ], radius ) => {
			const cs = Math.cos( spin );
			const sn = Math.sin( spin );
			const x1 = x * cs + z * sn;
			const z1 = z * cs - x * sn;
			const ct = Math.cos( tilt );
			const st = Math.sin( tilt );
			const y2 = y * ct - z1 * st;
			const z2 = y * st + z1 * ct;
			return [ size / 2 + x1 * radius, size / 2 - y2 * radius, z2 ];
		};

		// Point on the arc between a and b, lifted off the surface in the middle.
		const arcPoint = ( a, b, t ) => {
			const dot = Math.min( 1, Math.max( -1, a[ 0 ] * b[ 0 ] + a[ 1 ] * b[ 1 ] + a[ 2 ] * b[ 2 ] ) );
			const omega = Math.acos( dot ) || 1e-6;
			const k1 = Math.sin( ( 1 - t ) * omega ) / Math.sin( omega );
			const k2 = Math.sin( t * omega ) / Math.sin( omega );
			const lift = 1 + Math.sin( Math.PI * t ) * Math.min( 0.2, 0.04 + 0.07 * omega );
			return [ 0, 1, 2 ].map( ( i ) => ( a[ i ] * k1 + b[ i ] * k2 ) * lift );
		};

		// Prefer routes whose ends currently face the viewer, so arcs aren't wasted on the far side.
		const facing = ( city ) => project( city, 1 )[ 2 ] > 0.15;
		const spawnArc = () => {
			const front = CITIES.filter( facing );
			const pool = front.length >= 2 ? front : CITIES;
			const from = facing( CITIES[ 0 ] ) && Math.random() < 0.5 ? CITIES[ 0 ] : pool[ Math.floor( Math.random() * pool.length ) ];
			let to = from;
			while ( to === from ) {
				to = pool[ Math.floor( Math.random() * pool.length ) ];
			}
			arcs.push( { a: from, b: to, age: 0 } );
		};

		const draw = ( dt ) => {
			const radius = size * 0.4;
			ctx.setTransform( dpr, 0, 0, dpr, 0, 0 );
			ctx.clearRect( 0, 0, size, size );

			// Atmosphere and body.
			const halo = ctx.createRadialGradient( size / 2, size / 2, radius * 0.9, size / 2, size / 2, radius * 1.25 );
			halo.addColorStop( 0, 'rgba(139, 92, 246, 0.35)' );
			halo.addColorStop( 1, 'rgba(139, 92, 246, 0)' );
			ctx.fillStyle = halo;
			ctx.fillRect( 0, 0, size, size );
			const body = ctx.createRadialGradient( size * 0.4, size * 0.36, radius * 0.1, size / 2, size / 2, radius );
			body.addColorStop( 0, '#1c1340' );
			body.addColorStop( 1, '#07060f' );
			ctx.fillStyle = body;
			ctx.beginPath();
			ctx.arc( size / 2, size / 2, radius, 0, Math.PI * 2 );
			ctx.fill();

			for ( const dot of dots ) {
				const [ sx, sy, z ] = project( dot, radius );
				if ( z > 0 ) {
					ctx.fillStyle = `rgba(255,255,255,${ ( 0.12 + z * 0.6 ).toFixed( 2 ) })`;
					ctx.fillRect( sx - 0.7, sy - 0.7, 1.4, 1.4 );
				}
			}

			for ( const city of CITIES ) {
				const [ sx, sy, z ] = project( city, radius );
				if ( z > 0 ) {
					ctx.fillStyle = `rgba(103, 232, 249, ${ ( 0.5 + z * 0.5 ).toFixed( 2 ) })`;
					ctx.beginPath();
					ctx.arc( sx, sy, 2, 0, Math.PI * 2 );
					ctx.fill();
				}
			}

			// Arcs: the head runs from a to b, the tail follows, then a pulse at b.
			for ( let i = arcs.length - 1; i >= 0; i-- ) {
				const arc = arcs[ i ];
				arc.age += dt;
				const head = Math.min( 1, arc.age / 1.4 );
				const tail = Math.max( 0, ( arc.age - 0.9 ) / 1.4 );
				if ( tail >= 1 ) {
					arcs.splice( i, 1 );
					continue;
				}
				ctx.lineWidth = 1.6;
				ctx.lineCap = 'round';
				const steps = 28;
				let prev = null;
				for ( let s = 0; s <= steps; s++ ) {
					const t = tail + ( ( head - tail ) * s ) / steps;
					const p = project( arcPoint( arc.a, arc.b, t ), radius );
					if ( prev && p[ 2 ] > -0.15 && prev[ 2 ] > -0.15 ) {
						ctx.strokeStyle = `rgba(${ Math.round( 139 - 105 * t ) }, ${ Math.round( 92 + 119 * t ) }, ${ Math.round( 246 - 8 * t ) }, ${ ( 0.35 + 0.65 * ( s / steps ) ).toFixed( 2 ) })`;
						ctx.beginPath();
						ctx.moveTo( prev[ 0 ], prev[ 1 ] );
						ctx.lineTo( p[ 0 ], p[ 1 ] );
						ctx.stroke();
					}
					prev = p;
				}
				if ( head === 1 ) {
					const [ bx, by, bz ] = project( arc.b, radius );
					const pulse = Math.min( 1, ( arc.age - 1.4 ) / 0.9 );
					if ( bz > 0 && pulse > 0 ) {
						ctx.strokeStyle = `rgba(34, 211, 238, ${ ( 1 - pulse ).toFixed( 2 ) })`;
						ctx.lineWidth = 1.2;
						ctx.beginPath();
						ctx.arc( bx, by, 2 + pulse * 10, 0, Math.PI * 2 );
						ctx.stroke();
					}
				}
			}
		};

		const frame = ( now ) => {
			const dt = Math.min( 0.05, ( now - last ) / 1000 );
			last = now;
			if ( ! dragging ) {
				velocity += ( 0.18 - velocity ) * 0.03; // ease back to the idle spin
			}
			spin += velocity * dt;
			nextArc -= dt;
			if ( nextArc <= 0 && arcs.length < 9 ) {
				spawnArc();
				nextArc = 0.35 + Math.random() * 0.4;
			}
			draw( dt );
			running = visible && ! document.hidden;
			if ( running ) {
				requestAnimationFrame( frame );
			}
		};

		const start = () => {
			if ( running ) {
				return;
			}
			running = true;
			last = performance.now();
			requestAnimationFrame( frame );
		};

		canvas.addEventListener( 'pointerdown', ( e ) => {
			dragging = { x: e.clientX, y: e.clientY };
			canvas.setPointerCapture( e.pointerId );
		} );
		canvas.addEventListener( 'pointermove', ( e ) => {
			if ( ! dragging ) {
				return;
			}
			const dx = e.clientX - dragging.x;
			const dy = e.clientY - dragging.y;
			dragging = { x: e.clientX, y: e.clientY };
			spin += dx * 0.008;
			velocity = dx * 0.4;
			tilt = Math.max( -1.1, Math.min( 1.1, tilt + dy * 0.006 ) );
		} );
		const release = () => {
			dragging = null;
		};
		canvas.addEventListener( 'pointerup', release );
		canvas.addEventListener( 'pointercancel', release );

		resize();
		window.addEventListener( 'resize', resize );

		if ( reduced ) {
			// One still frame with a few finished arcs.
			for ( let i = 0; i < 5; i++ ) {
				spawnArc();
				arcs[ i ].age = 1.4;
			}
			draw( 0 );
			return;
		}

		new IntersectionObserver( ( [ entry ] ) => {
			visible = entry.isIntersecting;
			if ( visible ) {
				start();
			}
		} ).observe( canvas );
		document.addEventListener( 'visibilitychange', () => {
			if ( ! document.hidden && visible ) {
				start();
			}
		} );
	}

	$$( '.mt-visual--globe .mt-globe' ).forEach( globe );

	/* -------------------------------- Statement: words light up */

	const scrubs = reduced ? [] : $$( '.mt-scrub' ).map( ( el ) => ( { el, words: splitWords( el ) } ) );

	function updateScrub() {
		const vh = window.innerHeight;
		scrubs.forEach( ( { el, words } ) => {
			const r = el.getBoundingClientRect();
			const p = clamp( ( vh * 0.85 - r.top ) / ( vh * 0.5 + r.height * 0.6 ) );
			const lit = p * words.length;
			words.forEach( ( w, i ) => {
				w.style.opacity = ( 0.14 + 0.86 * clamp( lit - i ) ).toFixed( 2 );
			} );
		} );
	}

	/* ------------------------------------ Footer wordmark rises */

	const footWord = $( '.mt-footer__word span' );
	function updateFooter() {
		if ( ! footWord || reduced ) {
			return;
		}
		const r = footWord.parentElement.getBoundingClientRect();
		const p = clamp( ( window.innerHeight - r.top ) / r.height );
		footWord.style.setProperty( '--fy', `${ ( ( 1 - p ) * 35 ).toFixed( 1 ) }%` );
	}

	/* ------------------------ Footer wordmark: letters swell near the cursor */

	if ( footWord && finePointer && ! reduced ) {
		const letters = Array.from( footWord.textContent ).map( ( ch ) => {
			const l = document.createElement( 'span' );
			l.className = 'mt-footer__letter';
			l.textContent = ch;
			return l;
		} );
		footWord.textContent = '';
		letters.forEach( ( l ) => footWord.appendChild( l ) );

		const area = footWord.parentElement;
		area.addEventListener( 'pointermove', ( e ) => {
			letters.forEach( ( l ) => {
				const r = l.getBoundingClientRect();
				const d = Math.hypot( e.clientX - ( r.left + r.width / 2 ), ( e.clientY - ( r.top + r.height / 2 ) ) * 0.6 );
				const pull = Math.exp( -( ( d / 280 ) ** 2 ) );
				l.style.fontWeight = Math.round( 300 + 500 * pull );
			} );
		} );
		area.addEventListener( 'pointerleave', () => {
			letters.forEach( ( l ) => l.style.removeProperty( 'font-weight' ) );
		} );
	}

	/* --------------------------------------------- Scroll loop */

	let ticking = false;
	function update() {
		ticking = false;
		updateHeader();
		updateHero();
		updatePin();
		updateShowcase();
		updateScrub();
		updateFooter();
	}
	function requestUpdate() {
		if ( ! ticking ) {
			ticking = true;
			requestAnimationFrame( update );
		}
	}

	let resizeTimer;
	function onResize() {
		clearTimeout( resizeTimer );
		resizeTimer = setTimeout( () => {
			measurePin();
			measureShowcase();
			requestUpdate();
		}, 120 );
	}

	measurePin();
	measureShowcase();
	update();
	window.addEventListener( 'scroll', requestUpdate, { passive: true } );
	window.addEventListener( 'resize', onResize );
	window.addEventListener( 'load', onResize );
	document.fonts?.ready.then( onResize );

	if ( ! pinned && track ) {
		track.dispatchEvent( new Event( 'scroll' ) );
	}

	// Let the hidden initial state paint once, then play the intro.
	requestAnimationFrame( () => requestAnimationFrame( () => root.classList.add( 'is-loaded' ) ) );
} )();
