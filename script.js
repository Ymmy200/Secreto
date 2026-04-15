const questions = [
    { q: "A ver si es verdad que estamos en la jugada... Usted sabe que yo soy un despistado para muchas cosas, pero hay un número en el calendario que para mí es como una ley. No es el día en que nos conocimos, es el día que dio origen a todo lo que hoy me tiene aquí escribiéndole", a: "13/08" },
    { q: "Si usted tuviera que pintar su alegría o ese ratico en el que se siente más usted misma, ¿qué tono usaría? No es el rojo que quema, ni el blanco que no dice nada. Es ese que usted siempre elige para que todo se vea más tierno y que yo ya sé que es su marca personal.", a: "rosado" },
    { q: "Antes de que esto fuera real, fuimos vecinos en un mundo de mentiras. Entre misiones que no servían para nada y un parche que solo nosotros entendíamos, nos encontramos sin buscarnos. Ni el GPS nos hubiera ubicado en ese mapa digital.", a: "vecinos" }
];

const colors = ['#FF6B6B', '#FFD93D', '#FF8E9E', '#FFB347', '#AA96DA', '#95E1D3'];
const isMobile = window.innerWidth <= 480;

const config = isMobile ? [
    { x: -50, h: 230, r: -12 }, { x: 50, h: 230, r: 12 },
    { x: -25, h: 270, r: -6 },  { x: 25, h: 270, r: 6 },
    { x: 0, h: 310, r: 0 },     { x: 0, h: 180, r: 0 }
] : [
    { x: -65, h: 260, r: -12 }, { x: 65, h: 260, r: 12 },
    { x: -35, h: 300, r: -6 },  { x: 35, h: 300, r: 6 },
    { x: 0, h: 350, r: 0 },     { x: 0, h: 220, r: 0 }
];

let currentStep = 0;
const input = document.getElementById('answer-input');
const btn = document.getElementById('next-btn');
const qText = document.getElementById('question-text');

// Lógica de Bloqueo
btn.addEventListener('click', () => {
    const userAns = input.value.toLowerCase().trim();
    if (userAns === questions[currentStep].a.toLowerCase()) {
        currentStep++;
        if (currentStep < questions.length) {
            input.value = "";
            qText.innerText = questions[currentStep].q;
        } else {
            startMagic();
        }
    } else {
        gsap.to(".quiz-container", { x: 10, repeat: 3, yoyo: true, duration: 0.05 });
    }
});

function startMagic() {
    gsap.to("#quiz-overlay", { opacity: 0, duration: 1, onComplete: () => {
        document.getElementById('quiz-overlay').style.display = 'none';
        document.querySelector('.message-container').style.display = 'block';
        document.querySelector('.container').style.display = 'flex';
        document.body.style.background = "linear-gradient(180deg, #fff0f3 0%, #ffccd5 100%)";
        
        const audio = document.getElementById('bg-music');
        audio.volume = 0.3;
        audio.play();

        initFlowers();
    }});
}

function generatePetals(count, color) {
    let petals = '';
    for (let i = 0; i < count; i++) {
        petals += `<ellipse cx="50" cy="25" rx="6" ry="22" fill="${color}" transform="rotate(${i * (360/count)} 50 50)" />`;
    }
    return petals;
}

function initFlowers() {
    const area = document.getElementById('bouquet-area');
    colors.forEach((color, i) => {
        const f = document.createElement('div');
        f.className = 'flower';
        f.style.transform = `translateX(-50%) translateX(${config[i].x}px)`;
        f.innerHTML = `
            <div class="flower-head">
                <svg viewBox="0 0 100 100">
                    <g opacity="0.8">${generatePetals(10, color)}</g>
                    <g>${generatePetals(14, color)}</g>
                    <circle cx="50" cy="50" r="10" fill="#4b301e" />
                </svg>
            </div>
            <div class="stem" style="height: ${config[i].h}px;"></div>
        `;
        area.appendChild(f);
    });

    const tl = gsap.timeline();
    tl.to(".message", { opacity: 1, y: 15, duration: 1.5 })
      .call(() => typeWriter("Escuche que te gusta la creatividad, tambien que te gustaria que te hablen sobre cosas que no sabes, aunque claramente no te aburrire explicandote como funciona, esto es una pequeña muestra de lo que suele ser mi trabajo, junte muchas cosas que te gustan. Disfrutalo Ayleen <3", document.getElementById('typewriter')))
      .fromTo(".flower", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, "+=0.5")
      .fromTo(".stem", { scaleY: 0 }, { scaleY: 1, duration: 2, stagger: 0.2, ease: "power3.out" }, "-=0.1")
      .fromTo(".flower-head", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, stagger: 0.2, ease: "back.out(2)" }, "-=1.8");

    gsap.to(".flower", {
        rotation: i => config[i].r + (i % 2 === 0 ? 1.5 : -1.5),
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    initParticles();
}

function initParticles() {
    const atmosphere = document.getElementById('atmosphere');
    for (let i = 0; i < 35; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        atmosphere.appendChild(p);
        gsap.to(p, {
            opacity: Math.random() * 0.8 + 0.2,
            y: "-=30",
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}

function typeWriter(text, element, i = 0) {
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        setTimeout(() => typeWriter(text, element, i + 1), 50);
    }
}