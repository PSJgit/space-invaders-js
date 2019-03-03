
/* Imports
–––––––––––––––––––––––––––––––––––––––––––––––––– */
import '@babel/polyfill'

import {animateHelper} from './js/utils.js'

import {init, animateLoop} from './js/controller.js'

// style
import "./scss/main.scss";


const boot = init()

const animate = Promise.resolve(boot).then(animateLoop())