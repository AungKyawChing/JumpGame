function set() {
    let character = document.getElementById('character');
    let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
    let characterRight = parseInt(window.getComputedStyle(character).getPropertyValue('right'));
    let characterWidth = parseInt(window.getComputedStyle(character).getPropertyValue('width'));
    let ground = document.getElementById('ground');
    let groundBottom = parseInt(window.getComputedStyle(ground).getPropertyValue('bottom'));
    let groundHeight = parseInt(window.getComputedStyle(ground).getPropertyValue('height'));
    let isJumping = false;
    let upTime;
    let downTime;
    let displayScore = document.getElementById('score');
    let score = 0;
    const thresHold = document.getElementById("thressValue").value;
    const obs = document.getElementById("obstacleGenerateRate").value * 1000;
    console.log(thresHold);

    function jump() {
        if (isJumping) return;
        isJumping = true;
        upTime = setInterval(() => {
            characterBottom += 10;
            character.style.bottom = characterBottom + "px";
            if (characterBottom >= groundHeight + 250) {
                clearInterval(upTime);
                downTime = setInterval(() => {
                    characterBottom -= 10;
                    character.style.bottom = characterBottom + "px";
                    if (characterBottom <= groundHeight) {
                        clearInterval(downTime);
                        isJumping = false;
                    }
                }, 20);
            }
        }, 20);
    }

    function showScore() {
        score++;
        displayScore.innerText = score;
    }

    setInterval(showScore, 500)

    function generatedObstacle() {
        let obstacles = document.querySelector(".obstacles");
        let obstacle = document.createElement('div');
        obstacle.setAttribute('class', 'obstacle');
        obstacles.appendChild(obstacle);

        let randomTimeout = Math.floor(Math.random() * 10000) + 1000;
        let obstacleRight = -30;
        let obstacleBottom = 100;
        let obstacleWidth = 30;
        let obstacleHeight = Math.floor(Math.random() * 50) + 50;
        obstacle.style.backgroundColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;

        function moveObstacle() {
            obstacleRight += 5;
            obstacle.style.right = obstacleRight + 'px';
            obstacle.style.bottom = obstacleBottom + 'px';
            obstacle.style.width = obstacleWidth + 'px';
            obstacle.style.height = obstacleHeight + 'px';
            if (characterRight >= obstacleRight - characterWidth && characterRight <= obstacleRight + obstacleWidth && characterBottom <= obstacleBottom + obstacleHeight) {
                alert("Game Over! Take Love For Play my Game! Your Score is :" + score);
                clearInterval(obstacleInterval);
                clearTimeout(obstacleTimeout);
                location.reload();
            }
        }

        let obstacleInterval = setInterval(moveObstacle, 20);
        let obstacleTimeout = setTimeout(generatedObstacle, obs)
    }

    generatedObstacle()

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);

            // একটি অডিও বিশ্লেষক নেওয়া
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            source.connect(analyser);

            // নির্দিষ্ট ফ্রিকোয়েন্সি বা শব্দের তীব্রতা শনাক্ত করার লজিক
            function detectSound() {
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(dataArray);

                // আপনার নির্দিষ্ট ফ্রিকোয়েন্সি বা শব্দের তীব্রতা শনাক্ত করার লজিক
                // উদাহরণস্বরূপ, একটি নির্দিষ্ট ফ্রিকোয়েন্সির মান একটি নির্দিষ্ট থ্রেশহোল্ডের উপরে গেলে জাম্প করান
                const average = dataArray.reduce((sum, num) => sum + num) / dataArray.length;
                if (average > thresHold) { // আপনার প্রয়োজন অনুযায়ী থ্রেশহোল্ড পরিবর্তন করুন
                    console.log("detected");
                    jump();
                }
                requestAnimationFrame(detectSound);
            }
            detectSound();
        })
        .catch(err => console.error('Error accessing microphone:', err));
};