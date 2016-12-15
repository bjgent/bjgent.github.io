var GAME = {

	Player: function () {

		var scope = this;
        var score = 0;
        var lives = 3;

		var loader = new THREE.ObjectLoader();
		var camera, scene, renderer;

		var controls, effect, cameraVR, isVR;

		var events = {};
        
        var fGeo = new THREE.BoxBufferGeometry(1,1,1);
        var fMat = new THREE.MeshBasicMaterial({color:0x00ff00});
        var frog = new THREE.Mesh(fGeo,fMat);
        frog.position.y = .75;
        frog.position.z = 6;
        
        var cGeo = new THREE.BoxBufferGeometry(2,1,1);
        var sCMat = new THREE.MeshBasicMaterial({color: 0xffff00});
        var fCMat = new THREE.MeshBasicMaterial({color: 0xff0000});
        
        var lGeo = new THREE.BoxBufferGeometry(3,1,1);
        var lMat = new THREE.MeshBasicMaterial({color: 0x804000});
        
        var log1 = new THREE.Mesh(lGeo, lMat);
        var log2 = new THREE.Mesh(lGeo, lMat);
        var log3 = new THREE.Mesh(lGeo, lMat);
        
        log1.position.x = -9;
        log1.position.y = 0;
        log1.position.z = -2;
        
        log2.position.x = 0;
        log2.position.y = 0;
        log2.position.z = -2;
        
        log3.position.x = 9;
        log3.position.y = 0;
        log3.position.z = -2;
        
        var sCar1 = new THREE.Mesh(cGeo, sCMat);
        var sCar2 = new THREE.Mesh(cGeo, sCMat);
        var sCar3 = new THREE.Mesh(cGeo, sCMat);
        var sCar4 = new THREE.Mesh(cGeo, sCMat);
        
        sCar1.position.x = -10.5
        sCar1.position.y = 1;
        sCar1.position.z = 4;
        
        sCar2.position.x = -3.5
        sCar2.position.y = 1;
        sCar2.position.z = 4;
        
        sCar3.position.x = 3.5
        sCar3.position.y = 1;
        sCar3.position.z = 4;
        
        sCar4.position.x = 10.5
        sCar4.position.y = 1;
        sCar4.position.z = 4;
        
        var fCar1 = new THREE.Mesh(cGeo, fCMat);
        var fCar2 = new THREE.Mesh(cGeo, fCMat);
        var fCar3 = new THREE.Mesh(cGeo, fCMat);
        var fCar4 = new THREE.Mesh(cGeo, fCMat);
        
        fCar1.position.x = -10.5
        fCar1.position.y = 1;
        fCar1.position.z = 2;
        
        fCar2.position.x = -3.5
        fCar2.position.y = 1;
        fCar2.position.z = 2;
        
        fCar3.position.x = 3.5
        fCar3.position.y = 1;
        fCar3.position.z = 2;
        
        fCar4.position.x = 10.5
        fCar4.position.y = 1;
        fCar4.position.z = 2;

		this.dom = document.createElement( 'div' );

		this.width = 500;
		this.height = 500;

		this.load = function ( json ) {

			isVR = json.project.vr;

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setClearColor( 0x000000 );
			renderer.setPixelRatio( window.devicePixelRatio );

			if ( json.project.gammaInput ) renderer.gammaInput = true;
			if ( json.project.gammaOutput ) renderer.gammaOutput = true;

			if ( json.project.shadows ) {

				renderer.shadowMap.enabled = true;
				// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

			}

			this.dom.appendChild( renderer.domElement );

			this.setScene( loader.parse( json.scene ) );
			this.setCamera( loader.parse( json.camera ) );

			events = {
				init: [],
				start: [],
				stop: [],
				keydown: [],
				keyup: [],
				mousedown: [],
				mouseup: [],
				mousemove: [],
				touchstart: [],
				touchend: [],
				touchmove: [],
				update: []
			};

			var scriptWrapParams = 'player,renderer,scene,camera';
			var scriptWrapResultObj = {};

			for ( var eventKey in events ) {

				scriptWrapParams += ',' + eventKey;
				scriptWrapResultObj[ eventKey ] = eventKey;

			}

			var scriptWrapResult = JSON.stringify( scriptWrapResultObj ).replace( /\"/g, '' );

			for ( var uuid in json.scripts ) {

				var object = scene.getObjectByProperty( 'uuid', uuid, true );

				if ( object === undefined ) {

					console.warn( 'APP.Player: Script without object.', uuid );
					continue;

				}

				var scripts = json.scripts[ uuid ];

				for ( var i = 0; i < scripts.length; i ++ ) {

					var script = scripts[ i ];

					var functions = ( new Function( scriptWrapParams, script.source + '\nreturn ' + scriptWrapResult + ';' ).bind( object ) )( this, renderer, scene, camera );

					for ( var name in functions ) {

						if ( functions[ name ] === undefined ) continue;

						if ( events[ name ] === undefined ) {

							console.warn( 'APP.Player: Event type not supported (', name, ')' );
							continue;

						}

						events[ name ].push( functions[ name ].bind( object ) );

					}

				}

			}

			dispatch( events.init, arguments );

		};

		this.setCamera = function ( value ) {

			camera = value;
			camera.aspect = this.width / this.height;
			camera.updateProjectionMatrix();

			if ( isVR === true ) {

				cameraVR = new THREE.PerspectiveCamera();
				cameraVR.projectionMatrix = camera.projectionMatrix;
				camera.add( cameraVR );

				controls = new THREE.VRControls( cameraVR );
				effect = new THREE.VREffect( renderer );

				if ( WEBVR.isAvailable() === true ) {

					this.dom.appendChild( WEBVR.getButton( effect ) );

				}

				if ( WEBVR.isLatestAvailable() === false ) {

					this.dom.appendChild( WEBVR.getMessage() );

				}

			}

		};

		this.setScene = function ( value ) {

			scene = value;
            scene.add(frog);
            scene.add(sCar1);
            scene.add(sCar2);
            scene.add(sCar3);
            scene.add(sCar4);
            scene.add(fCar1);
            scene.add(fCar2);
            scene.add(fCar3);
            scene.add(fCar4);
            scene.add(log1);
            scene.add(log2);
            scene.add(log3);

		};

		this.setSize = function ( width, height ) {

			this.width = width;
			this.height = height;

			if ( camera ) {

				camera.aspect = this.width / this.height;
				camera.updateProjectionMatrix();

			}

			if ( renderer ) {

				renderer.setSize( width, height );

			}

		};

		function dispatch( array, event ) {

			for ( var i = 0, l = array.length; i < l; i ++ ) {

				array[ i ]( event );

			}

		}

		var prevTime, request;

		function animate( time ) {

			request = requestAnimationFrame( animate );
            
            if (frog.position.z == 4) {
                if (frog.position.x >= sCar1.position.x-1 && frog.position.x <= sCar1.position.x+1) {
                    lives--;
                    frog.position.x = 0;
                    frog.position.z = 6;
                } else if (frog.position.x >= sCar2.position.x-1 && frog.position.x <= sCar2.position.x+1) {
                    lives--;
                    frog.position.x = 0;
                    frog.position.z = 6;
                } else if (frog.position.x >= sCar3.position.x-1 && frog.position.x <= sCar3.position.x+1) {
                    lives--;
                    frog.position.x = 0;
                    frog.position.z = 6;
                } else if (frog.position.x >= sCar4.position.x-1 && frog.position.x <= sCar4.position.x+1) {
                    lives--;
                    frog.position.x = 0;
                    frog.position.z = 6;
                }
            }
            
            if (frog.position.z == 2) {
                if (frog.position.x >= fCar1.position.x-1 && frog.position.x <= fCar1.position.x+1) {
                    lives--;
                    frog.position.x = 0;
                    frog.position.z = 6;
                } else if (frog.position.x >= fCar2.position.x-1 && frog.position.x <= fCar2.position.x+1) {
                    lives--;
                    frog.position.x = 0;
                    frog.position.z = 6;
                } else if (frog.position.x >= fCar3.position.x-1 && frog.position.x <= fCar3.position.x+1) {
                    lives--;
                    frog.position.x = 0;
                    frog.position.z = 6;
                } else if (frog.position.x >= fCar4.position.x-1 && frog.position.x <= fCar4.position.x+1) {
                    lives--;
                    frog.position.x = 0;
                    frog.position.z = 6;
                }
            }
            
            if (frog.position.z == -2) {
                if (frog.position.x >= log1.position.x-1.5 && frog.position.x <= log1.position.x+1.5) {
                    frog.position.x = log1.position.x;
                } else if (frog.position.x >= log2.position.x-1.5 && frog.position.x <= log2.position.x+1.5) {
                    frog.position.x = log2.position.x;
                } else if (frog.position.x >= log3.position.x-1.5 && frog.position.x <= log3.position.x+1.5) {
                    frog.position.x = log3.position.x;
                } else {
                    lives--;
                    frog.position.x = 0;
                    frog.position.z = 6;
                }
            }
            
            if (frog.position.z == -4) {
                score += 100;
                frog.position.x = 0;
                frog.position.z = 6;
            }
            
            if (lives == 0) {
                lives = 3;
                score = 0;
            }
            
            if (log1.position.x >= -13.5) {
                log1.position.x -= .075;
            } else {
                log1.position.x = 13.5;
            }
            if (log2.position.x >= -13.5) {
                log2.position.x -= .075;
            } else {
                log2.position.x = 13.5;
            }
            if (log3.position.x >= -13.5) {
                log3.position.x -= .075;
            } else {
                log3.position.x = 13.5;
            }
            
            if (sCar1.position.x >= -13.5) {
                sCar1.position.x -= .05;
            } else {
                sCar1.position.x = 13.5;
            }
            if (sCar2.position.x >= -13.5) {
                sCar2.position.x -= .05;
            } else {
                sCar2.position.x = 13.5;
            }
            if (sCar3.position.x >= -13.5) {
                sCar3.position.x -= .05;
            } else {
                sCar3.position.x = 13.5;
            }
            if (sCar4.position.x >= -13.5) {
                sCar4.position.x -= .05;
            } else {
                sCar4.position.x = 13.5;
            }
            
            if (fCar1.position.x >= -13.5) {
                fCar1.position.x -= .1;
            } else {
                fCar1.position.x = 13.5;
            }
            if (fCar2.position.x >= -13.5) {
                fCar2.position.x -= .1;
            } else {
                fCar2.position.x = 13.5;
            }
            if (fCar3.position.x >= -13.5) {
                fCar3.position.x -= .1;
            } else {
                fCar3.position.x = 13.5;
            }
            if (fCar4.position.x >= -13.5) {
                fCar4.position.x -= .1;
            } else {
                fCar4.position.x = 13.5;
            }

			try {

				dispatch( events.update, { time: time, delta: time - prevTime } );

			} catch ( e ) {

				console.error( ( e.message || e ), ( e.stack || "" ) );

			}

			if ( isVR === true ) {

				camera.updateMatrixWorld();

				controls.update();
				effect.render( scene, cameraVR );

			} else {

                
                renderer.render( scene, camera );

			}

			prevTime = time;
            
            document.getElementById("score").innerHTML = score;
            document.getElementById("lives").innerHTML = lives;

		}

		this.play = function () {

			document.addEventListener( 'keydown', onDocumentKeyDown );
			document.addEventListener( 'keyup', onDocumentKeyUp );
			document.addEventListener( 'mousedown', onDocumentMouseDown );
			document.addEventListener( 'mouseup', onDocumentMouseUp );
			document.addEventListener( 'mousemove', onDocumentMouseMove );
			document.addEventListener( 'touchstart', onDocumentTouchStart );
			document.addEventListener( 'touchend', onDocumentTouchEnd );
			document.addEventListener( 'touchmove', onDocumentTouchMove );

			dispatch( events.start, arguments );

			request = requestAnimationFrame( animate );
			prevTime = performance.now();

		};

		this.stop = function () {

			document.removeEventListener( 'keydown', onDocumentKeyDown );
			document.removeEventListener( 'keyup', onDocumentKeyUp );
			document.removeEventListener( 'mousedown', onDocumentMouseDown );
			document.removeEventListener( 'mouseup', onDocumentMouseUp );
			document.removeEventListener( 'mousemove', onDocumentMouseMove );
			document.removeEventListener( 'touchstart', onDocumentTouchStart );
			document.removeEventListener( 'touchend', onDocumentTouchEnd );
			document.removeEventListener( 'touchmove', onDocumentTouchMove );

			dispatch( events.stop, arguments );

			cancelAnimationFrame( request );

		};

		this.dispose = function () {

			while ( this.dom.children.length ) {

				this.dom.removeChild( this.dom.firstChild );

			}

			renderer.dispose();

			camera = undefined;
			scene = undefined;
			renderer = undefined;

		};

		//

		function onDocumentKeyDown( event ) {

			dispatch( events.keydown, event );
            if (event.keyCode == 37 && frog.position.x-2 > -16) {
                frog.position.x -= 2;
            } else if (event.keyCode == 38 && frog.position.z-2 > -6) {
                frog.position.z -= 2;
            } else if (event.keyCode == 39 && frog.position.x+2 < 16) {
                frog.position.x += 2;
            } else if (event.keyCode == 40 && frog.position.z+2 < 8) {
                frog.position.z += 2;
            }
		}

		function onDocumentKeyUp( event ) {

			dispatch( events.keyup, event );

		}

		function onDocumentMouseDown( event ) {

			dispatch( events.mousedown, event );

		}

		function onDocumentMouseUp( event ) {

			dispatch( events.mouseup, event );

		}

		function onDocumentMouseMove( event ) {

			dispatch( events.mousemove, event );

		}

		function onDocumentTouchStart( event ) {

			dispatch( events.touchstart, event );

		}

		function onDocumentTouchEnd( event ) {

			dispatch( events.touchend, event );

		}

		function onDocumentTouchMove( event ) {

			dispatch( events.touchmove, event );

		}

	}

};
