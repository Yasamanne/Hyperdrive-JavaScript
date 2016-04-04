                      
                        function plot(values){
			var container;
			var camera, scene, renderer;
			var plane;
                        var mesh;
                        var projector = new THREE.Projector();
			var isShiftDown = false;
                        var mouse = new THREE.Vector2();
                        var raycaster = new THREE.Raycaster();
			var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
			var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff80, overdraw: 0.5 } );
                        var pointMeshs = new THREE.Object3D();
			

			init(values);
			render();

			function init(values) {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				var info = document.createElement( 'div' );
				info.style.position = 'absolute';
				info.style.top = '10px';
				info.style.width = '100%';
				info.style.textAlign = 'center';
				info.innerHTML = 'Hyperdrive';
				container.appendChild( info );

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.set( 500, 800, 1300 );
				camera.lookAt( new THREE.Vector3() );
                                
                                controls = new THREE.OrbitControls( camera );
                                controls.addEventListener( 'change', render );

				scene = new THREE.Scene();

				// Grid

				var size = 100, step = 10;

				var geometry = new THREE.Geometry();

				for ( var i = - size; i <= size; i += step ) {

					geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
					geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

					geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
					geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

				}

				var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );

				var line = new THREE.LineSegments( geometry, material );
				scene.add( line );

				//

			
				

				var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
				geometry.rotateX( - Math.PI / 2 );

				plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
				scene.add( plane );

				var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );


                    var point = {x:0,y:0,z:0};
                    var pointgeometry = new THREE.SphereGeometry(1, 1, 1);
                    material = new THREE.MeshLambertMaterial({color: 0x00FF00});
                    mesh = new THREE.Mesh(pointgeometry, material);
                    mesh.position.set(point.x, point.y, point.z);
                    pointMeshs.add(mesh);
                    
                    point = {x: 18, y: 20, z: 45};
                    pointgeometry = new THREE.SphereGeometry(1, 1, 1);
                    material = new THREE.MeshLambertMaterial({color: 0xFF0000});
                    mesh = new THREE.Mesh(pointgeometry, material);
                    mesh.position.set(point.x, point.y, point.z);
                    pointMeshs.add(mesh);
                    
                    
                    //var textsprite  = makeTextSprite("Hellooo");
                    //scene.add(textsprite);
                    var entryPoint, exitPoint;
                   for (var i = 0; i < values.length; i++) {
                    point = values[i];
                    pointgeometry = new THREE.SphereGeometry(1, 1, 1);
                    material = new THREE.MeshLambertMaterial({color: 0x0000FF});
                    if(i===0){material = new THREE.MeshLambertMaterial({color: 0xFF00FF});entryPoint = point;}
                    if(i===values.length-1){material = new THREE.MeshLambertMaterial({color: 0xFF00FF});exitPoint = point;}
                    mesh = new THREE.Mesh(pointgeometry, material);
                    mesh.position.set(point.x, point.y, point.z);
                    pointMeshs.add(mesh);
                }
                

                                
				// Lights

				var ambientLight = new THREE.AmbientLight( 0x606060 );
				scene.add( ambientLight );

				var directionalLight = new THREE.DirectionalLight( 0xffffff );
				directionalLight.position.x = Math.random() - 0.5;
				directionalLight.position.y = Math.random() - 0.5;
				directionalLight.position.z = Math.random() - 0.5;
				directionalLight.position.normalize();
				scene.add( directionalLight );

				var directionalLight = new THREE.DirectionalLight( 0x808080 );
				directionalLight.position.x = Math.random() - 0.5;
				directionalLight.position.y = Math.random() - 0.5;
				directionalLight.position.z = Math.random() - 0.5;
				directionalLight.position.normalize();
				scene.add( directionalLight );
                                
                                var line1 = buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( entryPoint.x, entryPoint.y, entryPoint.z ), 0x078800, false );
                                var line2 = buildAxis( new THREE.Vector3( exitPoint.x, exitPoint.y, exitPoint.z ), new THREE.Vector3( 18, 20, 45 ), 0x078800, false );
                                scene.add( line1 );
                                scene.add( line2 );
                                
                                	var axes = buildAxes();
                                scene.add( axes );
                                scene.add(pointMeshs);
                                


				renderer = new THREE.CanvasRenderer();
				renderer.setClearColor( 0xf0f0f0 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild(renderer.domElement);

				window.addEventListener( 'resize', onWindowResize, false );
                                
                                //window.addEventListener('mousemove', onDocumentMouseMove, false);

			}
                        
                        	function buildAxes() {
		var axes = new THREE.Object3D();

		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 100, 0, 0 ), 0xFF0000, false ) ); // +X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -100, 0, 0 ), 0x800000, true) ); // -X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 100, 0 ), 0x00FF00, false ) ); // +Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -100, 0 ), 0x008000, true ) ); // -Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 100 ), 0x0000FF, false ) ); // +Z
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -100 ), 0x000080, true ) ); // -Z

		return axes;

	}
        	function buildAxis( src, dst, colorHex, dashed ) {
		var geom = new THREE.Geometry(),
			mat; 

		if(dashed) {
			mat = new THREE.LineDashedMaterial({ linewidth: 1, color: colorHex, dashSize: 5, gapSize: 5 });
		} else {
			mat = new THREE.LineBasicMaterial({ linewidth: 1, color: colorHex });
		}

		geom.vertices.push( src.clone() );
		geom.vertices.push( dst.clone() );

		var axis = new THREE.Line( geom, mat );

		return axis;

	}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}
 
  function onDocumentMouseMove(e){
  	mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
		mouse.y = 1 - 2 * ( e.clientY / window.innerHeight );

		raycaster.setFromCamera( mouse, camera );
			var intersects = raycaster.intersectObjects( pointMeshs.children );

		//pointMeshs.children.forEach(function( point ) {
		//	point.material.color.setRGB( 0, 0, 0 );
		//});

			
		for( var i = 0; i < intersects.length; i++ ) {
			var intersection = intersects[ i ],
				obj = intersection.object;

			obj.material.color.setRGB( 1, 0, 0 );
		}
        
  }


			function render() {

				renderer.render( scene, camera );

			}
                    }