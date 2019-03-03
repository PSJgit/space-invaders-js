

export const keyPressArr = [];

function keysPressed(e) {
    keyPressArr[e.keyCode] = true;

}
 
function keysReleased(e) {
    keyPressArr[e.keyCode] = false;
}       


window.addEventListener('keydown', (e) => {
    keysPressed(e)
}, false)

window.addEventListener('keyup', (e) => {
    keysReleased(e)
}, false)


export default keyPressArr