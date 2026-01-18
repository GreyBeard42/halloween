let user, pumpkins, dificulty, score, shake, music
let userhasclicked = false

function preload() {
    music = loadSound("Halloween.mp3")
}

function setup() {
    let cnvs = createCanvas(windowWidth, windowHeight)
    cnvs.parent('canvas')

    colorMode(RGB, 100)
    rectMode(CENTER)
    ellipseMode(CENTER)
    user = new Beam()
    pumpkins = []
    dificulty = 500
    score = 0
    shake = new Shake()
}

function draw() {
    background(0)
    if(mouseIsPressed) userhasclicked = true

    if(frameCount%3==0) user.change()
    if(mouseIsPressed) {
        user.ghost = 10
    }
    user.draw()
    shake.update()

    if(round(random(1, 30)) == 1) pumpkins.push(new Pumpkin())
    pumpkins.forEach((p) => {
        if(p != 0) {
            p.draw()
            p.move()
        }
    })

    fill(80, 80, 100)
    textFont("Beardy")
    textSize(width/40)
    textAlign(LEFT, TOP)
    text("Click to blast those dang pumpkins!   |   Score: "+score, 5, 5)
    textAlign(RIGHT, TOP)
    text("Oct 14th, 2024", width-5, 5)

    if(!music.isPlaying() && userhasclicked) music.play()
}

function over() {
    background(0)
    fill(80, 80, 100)
    textFont("Beardy")
    textSize(width/40)
    textAlign(LEFT, TOP)
    text("Click to blast those dang pumpkins!   |   Score: "+score, 5, 5)
    textAlign(RIGHT, TOP)
    text("Oct 14th, 2024", width-5, 5)
    textAlign(CENTER, CENTER)
    textSize(width/15)
    text("Game Over", width/2, height/2)
}

class Beam {
    constructor() {
        this.change()
        this.ghost = 0
        this.dots = []
        this.dotcount = 0
        this.width = width/25
    }
    change() {
        this.points = []
        for(let y=0; y<20; y++) {
            this.points.push(random(-this.width/2, this.width/2))
        }
    }
    draw() {
        if(this.ghost>0) {
            this.dots.push(new Dot(mouseX, random(0, height)))
            user.dotcount++
        }
        
        noStroke()
        fill(80, 0, 100, this.ghost)
        rect(mouseX+shake.x, height/2, this.width, height)

        stroke(30, 0, 100, this.ghost*10)
        strokeWeight(this.width/10)
        let px = mouseX+shake.x
        let py = -height/20
        this.points.forEach((p) => {
            line(px+shake.x, py, mouseX+p+shake.x, py+height/20)
            px = mouseX+p
            py += height/19
        })

        noStroke()
        this.dots.forEach((d) => {
            if(d!=0) d.draw()
        })

        this.ghost -= 0.5
    }
}

class Dot {
    constructor(x, y) {
        this.id = user.dots.length
        this.dir = random(0, 2)
        if(this.dir < 1) this.dir -= 0.5
        else this.dir += 0.5
        this.dir--
        this.x = x
        this.y = y
        this.size = random(width/60, width/100)
        this.ghost = user.ghost*2.5
    }
    draw() {
        fill(80, 0, 100, this.ghost)
        ellipse(this.x+shake.x, this.y, this.size, this.size)
        this.x += this.dir
        this.ghost -= 1/4

        if(this.ghost<0) {
            user.dots[this.id] = 0
            user.dotcount--
        }
    }
}

class Pumpkin {
    constructor() {
        this.id = pumpkins.length
        this.x = random(width/50, width-width/50)
        this.y = 0
        this.health = 10
    }
    draw() {
        noStroke()
        fill('orange')
        ellipse(this.x+shake.x, this.y, width/25, width/30)
        fill('green')
        rect(this.x+shake.x, this.y-width/48, width/80, width/90)
        textAlign(CENTER)
        fill(80, 80, 100)
        textSize(width/60)
        text(this.health+"/10", this.x+shake.x, this.y+width/40)

        //it's user.width instead of user.width/2 for bigger hitbox
        if(dist(mouseX, 0, this.x, 0) < user.width && user.ghost > 8) this.health--
        if(this.health<0) {
            shake.request()
            pumpkins[this.id] = 0
            dificulty -= 7
            score += 10
        }
    }
    move() {
        this.y += height/dificulty
        if(this.y >= height) draw = over
    }
}

class Shake {
    constructor() {
        this.x = 0
        this.xvel = 0
        this.time = 0
        this.step = 0
        this.target = 0
    }
    request(x, frames) {
        if(round(this.x) == 0) this.shake(x, frames)
    }
    shake(x=-width/30, frames=3) {
        this.step = 1
        this.target = x
        this.xvel = x/frames
    }
    update() {
        this.x += this.xvel
        if(this.step == 1 && abs(this.target-this.x) < width/100) this.step = 2
        if(this.step == 2) this.xvel = (this.target-this.x)/3

        if(this.step == 2 && round(this.x) == round(this.target)) this.step = 0
        if(this.step == 0) {
            this.target = 0
            this.xvel = (this.target-this.x)/3
        }
    }
}