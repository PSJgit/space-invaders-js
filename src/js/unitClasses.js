
/* Imports
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import {canvas, ctx, imagesArr, enemyMunitionsArr, playerMunitionsArr} from './controller.js'
import keyPressArr from './keyboard.js'
import {detectCollision, bounceOff} from './utils.js'


export class Unit {
    constructor(x, y, width, height, boundsX, moveDownY) {
        
        this.id = 'invader'
        this.x = x
        this.y = y
        this.velocity = {
            x: 0.5,
            y: 0
        }
        this.height = height
        this.width = width
        this.boundsX = boundsX
        this.moveDownY = moveDownY
        this.moveTime = 3000
        this.lastMoved = null
        // store the val statically so we can reset later
        Unit.moveDownY = this.moveDownY
        this.status = 'live'
    }

    fire() {
        enemyMunitionsArr.push(new Munition(this.x + (this.width / 2), this.y, 2, 15, true, 'red')) 
    }

    draw() {
        ctx.drawImage(imagesArr[1], this.x, this.y, this.width, this.height)
    }

    update(units, invaderCount) {
        if (this.status === 'live') {
            this.draw()



            for (var i = 0; i < units.length; i++) {
                //console.log(`0.99998${unitsLength}`)
                if (Math.random() > (units.length >= invaderCount / 2 ? 0.99998 : 0.9999 )  ) {
                    this.fire()
                }
                // prevent unexpected overlap
                if (detectCollision(this, units[i])) {
                    bounceOff(this, units[i])
                    //munitions.splice(this, 1)
                    //target.splice(t, 1)
                }
            }

            // keep units in their patrol routes
            if ((this.x < this.boundsX.start || this.x + this.width > this.boundsX.finish)) {
                this.velocity.x = -this.velocity.x
                this.moveDownY--

            // move units down the y axis and reset the value
                if (this.moveDownY === 0) {
                    this.velocity.y = 0.4
                    this.moveDownY = Unit.moveDownY  
                }
            }

            if(this.lastMoved === null || ( new Date().getTime() - this.lastMoved ) > this.moveTime) {
                this.lastMoved = new Date().getTime()
                this.velocity.y = 0
            }
            // update the position of the units by its velocity X and Y speeds
            this.x += this.velocity.x
            this.y += this.velocity.y
        }
    }

}


export class Player {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.velocity = {
            x: 0,
            y: 2
        }
        this.width = width
        this.height = height
        this.lastLaserFiredAt = null
        this.id = 'player'
        this.status = 'live'

    }

    draw() {

        ctx.drawImage(imagesArr[0], this.x, this.y, this.width, this.height)
    }

    fire(rateOfFire = 1000) {
        if(this.lastLaserFiredAt === null || ( new Date().getTime() - this.lastLaserFiredAt ) > rateOfFire) {
            //console.log(this.lastLaserFiredAt)
            playerMunitionsArr.push(new Munition(this.x + (this.width / 2), this.y-this.height, 2, 15, false, 'green')) 
            this.lastLaserFiredAt = new Date().getTime()
        }
    }

    update(munitions, player) {

        if (this.status === 'live') {

            this.draw()

            // left
            if (keyPressArr[37]) {
              
                if (this.x < 0) {
                    this.x -= 0
                } else {
                    this.x -= 4
                }
            }
         
            // right
            if (keyPressArr[39]) {
                if (this.x + this.width > canvas.width) {
                    this.x += 0
                } else {
                    this.x += 4
                }

            }

            // space
            if (keyPressArr[32]) {
              this.fire()
            }
        }
    }
}

export class Munition {
    constructor(x, y, width, height, fromInvader, color){
        this.x = x
        this.y = y
        this.velocity = {
            x: 0,
            y: fromInvader ? 2 : -2
        }
        this.width = width
        this.height = height
        this.color = color
        this.status = 'live'
    }

    draw() {
        ctx.globalCompositeOperation = 'destination-over'
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update(munitions, target) {

        if (this.status === 'live') {

            this.draw()

            this.y += this.velocity.y

            // check collision for player or units
            if (target.id === 'player') {
                if (detectCollision(this, target)) {
                    // no more rendering of player
                    target.status = 'dead'
                }
            } else {
                // targets are invaders
                for (var t = 0; t < target.length; t++) {
                    // check collision
                    if (detectCollision(this, target[t])) {
                        //bounceOff(this, target[t])
                        target[t].status = 'dead'
                        this.status = 'dead'
                        // keep the arrays slim
                        munitions.splice(this, 1)
                        target.splice(t, 1)
                        console.log(munitions)
                        console.log(target)
                    }
                }
            }

            // remove munitions that are off screen
            for (var m = 0; m < munitions.length; m++) { 
                if (munitions[m].y > canvas.height + munitions[m].height || munitions[m].y < - munitions[m].height ) {
                    munitions.splice(m, 1)
                }
            }
        }
    }
}


