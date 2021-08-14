// import { Scene3D, THREE } from '@enable3d/phaser-extension'

// function debounce (func, timeout = 300) {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => { func.apply(this, args); }, timeout);
//   };
// }

// const log = debounce((...args) => console.log(...args))

// // const toOrthographic = ({ x, y }) => ({ x: x / 0.11, y: 0, z: y / 0.08 })

// const toOrthographic = (x, y, z, width,height) => { 
//   return {
//     x: x - width / 2,
//       y: -1 * y + height / 2,
//         z
//         }
// }

// export default class BattleScene extends Scene3D {

//   private raycaster
//   private mouse
//   private selected

//   init () {
//     // init third dimension with a custom camera
//     // https://threejs.org/docs/#api/en/cameras/OrthographicCamera
//     const frustumSize = 10
//     const aspect = this.cameras.main.width / this.cameras.main.height
//     this.accessThirdDimension({
//       camera: new THREE.OrthographicCamera(
//         (frustumSize * aspect) / -2,
//         (frustumSize * aspect) / 2,
//         frustumSize / 2,
//         frustumSize / -2
//       )
//     })
//   }

//   create () {

//     this.raycaster = new THREE.Raycaster()
//     this.mouse = new THREE.Vector2()


//     this.raycaster.setFromCamera(this.mouse, this.third.camera);

//     this.third.warpSpeed('-camera')
//     this.third.camera.position.set(10, 10, 10)
//     this.third.camera.lookAt(0, 0, 0)

//     const originalPolygon = [
//       0, 0.08, // Top
//       0.11, 0, // Right
//       0, -0.08, // Bottom
//       -0.11, 0 // Left
//     ]



//     this.input.on('pointermove', (e) => {
//       const { x, y, z } = this.getOrthographicPointer()
//       this.selected.position.set(x, y, z)

//       const rect = this.game.canvas.getBoundingClientRect();
//       // get a canvas content pixel position
//       const { width, height } = rect;
//       const canvasX = (e.clientX - rect.left) * width / rect.width;
//       const canvasY = (e.clientY - rect.top) * height / rect.height;

      

//       log(rect)
//     })

//     this.third.add.box({ x: 0, y: 0.5, z: 0 }, { lambert: { color: 'darkgray' } })
//     this.selected = this.third.add.ground({ x: 1, y: 0, z: 1, depth: 0.05 }, { lambert: { color: 'blue', transparent: true, opacity: 0.5 } })
//     // this.third.add.ground({ ...toOrthographic({ x: 0.11, y: 0.16 }), depth: 0.05 }, { lambert: { color: 'red', transparent: true, opacity: 0.5 } })
//     // this.third.add.ground({ ...toOrthographic({ x: 0, y: -0.575 }), depth: 0.05 }, { lambert: { color: 'red', transparent: true, opacity: 0.5 } })
//   }

//   getPointer () {
//     const pointer = this.input.activePointer
//     const x = (pointer.x / this.cameras.main.width) * 2 - 1
//     const y = -(pointer.y / this.cameras.main.height) * 2 + 1
//     return { x, y }
//   }

//   private getOrthographicPointer () {
//     const { x, y } = this.getPointer()
//     const halfTileWidth = 0.22
//     const halfTileHeight = 0.16

//     const ty = y - x / 2 - halfTileHeight
//     const tx = x + ty
//     const y2 = Math.round(-ty / halfTileWidth)
//     const x2 = Math.round(tx / halfTileWidth) + 1

//     log(x, y, x2, y2)

//     return { x: y2, y: 0, z: -x2 };
//   }

//   update () {

//   }

// }
