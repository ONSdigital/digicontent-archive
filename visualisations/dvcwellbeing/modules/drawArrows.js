export function drawArrow(change) {

    if (change == "positive") {

        return `<svg width="20" height="20" class="positiveChange" viewBox="-1 -1 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3.00195L10 16.998M10 3.00195L15.5 8.3744M10 3.00195L4.5 8.50391" stroke="#206095" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`
    }

    else if (change == "negative") {

        return `<svg width="20" height="20" viewBox="-1 -1 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> 
            <path d="M10 16.998L10 3.00195M10 16.998L4.5 11.6256M10 16.998L15.5 11.4961" stroke="#206095" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`

    }

    else {
        return " "
    }

}
