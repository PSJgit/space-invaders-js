
/* Imports
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import preloader from './preloader.js'
import {Player, Unit, Munitions} from './unitClasses.js'

// images
import playerSprite from '../images/player1.png'
import invaderSprite from '../images/invader1.png'

/* main vars
–––––––––––––––––––––––––––––––––––––––––––––––––– */

export let enemyMunitionsArr
export let playerMunitionsArr
export let imagesArr

let unitsArr
let playerShip

// 13 cols, 3 rows, 39 units for the invaders
const invaderCols = 13
const invaderRows = 3
const invaderCount = invaderCols * invaderRows
const moveDownY = 2

// canvas set up
export const canvas = document.querySelector('canvas')
export const ctx = canvas.getContext('2d')

canvas.width = 800
canvas.height = 600

///////////////////////////
    
export const init = () => {

    imagesArr = preloader([playerSprite, invaderSprite]);
    unitsArr = []
    enemyMunitionsArr = []
    playerMunitionsArr = []

    for (let i = 0; i < 39; i++) {

		const width = 20
		const height = 20	
    	const padding = 20
        
        // calc the rows / cols of invaders
    	let x = width + (i % invaderCols) * (width + padding)
    	let y = height + (i % invaderRows) * (height + padding)
    	let boundsX = {
            start : x,
            finish : x + (width * 13)
        }
        
        unitsArr.push(new Unit(x, y, width, height, boundsX, moveDownY))
    }

    const playerHeight = 30
    const playerWidth = 45

    playerShip = new Player(canvas.width / 2, canvas.height - (playerHeight * 2), playerWidth, playerHeight)

/*    console.log(player)
    console.warn(unitsArr)
    console.warn(playerMunitionsArr)
    console.warn(enemyMunitionsArr)*/

}

// Animation Loop, where we update + clear the canvas, then render new properties in
export function animateLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // player
    playerShip.update()

    // invaders
    unitsArr.forEach(unit => {
    	unit.update(unitsArr, invaderCount);
    })

    // ENEMY muntions
    enemyMunitionsArr.forEach(munition => {
        munition.update(enemyMunitionsArr, playerShip)
    })

    // PLAYER munitions
    playerMunitionsArr.forEach(munition => {
        munition.update(playerMunitionsArr, unitsArr)
    })

	// 60 fps
    setTimeout(requestAnimationFrame(animateLoop), 1000 / 60);
    
}