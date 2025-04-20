document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const mainSection = document.querySelector('header'); // 고정 영역

    const disappearTargets = [
        document.querySelector('.D'),
        document.querySelector('.SIGN'),
        document.querySelector('.CHOI'),
        document.querySelector('.i'),
        document.querySelector('.intro-f')
    ];

    const appearTargets = [
        document.querySelector('.intro-E'),
        document.querySelector('.R'),
        document.querySelector('.PORT'),
        document.querySelector('.OLIO')
    ];

    const verticalLines = document.querySelectorAll('.vertical-line');
    const triggerSections = [
        {
            element: document.querySelector('.con01'),
            threshold: 1.7
        },
        {
            element: document.querySelector('footer'),
            threshold: 0.6
        }
    ];

    const lines = document.querySelectorAll('.line'); // 선
    const maxScroll = disappearTargets.length + appearTargets.length;
    let scrollCount = 0;

    function isInMainSection() {
        const rect = mainSection.getBoundingClientRect();
        return rect.top <= 0 && rect.bottom > 0;
    }

    function checkVerticalLineTrigger() {
        const windowHeight = window.innerHeight;

        triggerSections.forEach((sectionObj, index) => {
            const sectionTop = sectionObj.element.getBoundingClientRect().top;
            const threshold = sectionObj.threshold;

            if (sectionTop < windowHeight * threshold) {
                verticalLines[index].classList.add('active');
            } else {
                verticalLines[index].classList.remove('active');
            }
        });
    }

    // ✅ wheel 이벤트 하나로 통합
    window.addEventListener('wheel', (e) => {
        const direction = e.deltaY;

        // vertical-line 등장 여부 체크
        checkVerticalLineTrigger();

        // 메인 섹션이 아니면 고정 해제
        if (!isInMainSection()) {
            body.classList.remove('locked');
            return;
        }

        // 아래로 스크롤
        if (direction > 0 && scrollCount < maxScroll) {
            scrollCount++;
            lines.forEach(line => {
                line.classList.add('draw', 'left-to-right');
                line.classList.remove('right-to-left');
            });
        }
        // 위로 스크롤
        else if (direction < 0 && scrollCount > 0) {
            scrollCount--;
            lines.forEach(line => {
                line.classList.add('draw', 'right-to-left');
                line.classList.remove('left-to-right');
            });
        }

        // 텍스트 fade 처리
        disappearTargets.forEach((el, index) => {
            if (scrollCount > index) {
                el.classList.remove('fade-in');
                el.classList.add('fade-out');
            } else {
                el.classList.remove('fade-out');
                el.classList.add('fade-in');
            }
        });

        appearTargets.forEach((el, index) => {
            if (scrollCount > disappearTargets.length + index - 1) {
                el.classList.remove('fade-out', 'hidden');
                el.classList.add('fade-in');
            } else {
                el.classList.remove('fade-in');
                el.classList.add('fade-out');
                setTimeout(() => {
                    el.classList.add('hidden');
                }, 700);
            }
        });

        // 고정 처리
        if (scrollCount <= 0 || scrollCount >= maxScroll) {
            body.classList.remove('locked');
        } else {
            body.classList.add('locked');
        }
    });

    // 일반 scroll에도 vertical-line 작동
    window.addEventListener('scroll', checkVerticalLineTrigger);
});



document.addEventListener("DOMContentLoaded", () => {
    // 페이지 새로고침 시 스크롤을 시작 화면으로 이동
    window.scrollTo(0, 0);  // 페이지 상단으로 이동

    // 각 섹션의 타겟을 설정
    const skillTarget = document.querySelector(".skills-percent");  // 스킬 퍼센트 섹션

    // 애니메이션 실행 여부 추적 변수
    let hasAnimatedSkill = false;
    let hasStartedObserving = false; // 스크롤 이후에만 옵저버 작동하도록

    // IntersectionObserver 설정
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 각 섹션에 대한 애니메이션 실행 여부 체크 후 실행
                if (entry.target === skillTarget && !hasAnimatedSkill) {
                    startSkillsAnimation();
                    hasAnimatedSkill = true;
                }

            } else {
                // 화면에서 벗어나면 애니메이션을 리셋할 수 있도록 false로 설정
                if (entry.target === skillTarget) {
                    hasAnimatedSkill = false;
                    resetSkillsAnimation(); // 바 애니메이션을 초기화
                }

            }
        });
    }, { threshold: 0.5 }); // 50% 이상 보이면 실행

    // 📌 스크롤 이벤트가 발생해야 옵저버 시작
    window.addEventListener("scroll", () => {
        if (!hasStartedObserving) {
            // 각 섹션을 옵저버에 추가
            observer.observe(skillTarget);

            hasStartedObserving = true;

            // 더 이상 스크롤 이벤트를 처리할 필요 없음
            window.removeEventListener("scroll", arguments.callee);
        }
    });
});

// 숫자 카운팅 함수
function animateNumber(element, start, end, duration) {
    let startTime = null;

    function update(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const rate = Math.min(progress / duration, 1);
        const value = Math.floor(start + (end - start) * rate);
        element.textContent = value;
        if (rate < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// 🟩 스킬 섹션 애니메이션 (기존 스킬 애니메이션 함수)
function startSkillsAnimation() {
    animateNumber(document.querySelector(".a-n"), 0, 100, 2000);
    animateNumber(document.querySelector(".p-n"), 0, 100, 2000);
    animateNumber(document.querySelector(".x-n"), 0, 70, 2000);

    const ai = document.querySelector(".ai-bar");
    const ps = document.querySelector(".ps-bar");
    const xd = document.querySelector(".xd-bar");

    ai.style.setProperty('--fill', '100%');
    ps.style.setProperty('--fill', '100%');
    xd.style.setProperty('--fill', '70%');
}

// 🟩 프로젝트 섹션 애니메이션 (기존 프로젝트 섹션 애니메이션 함수)
function startProject1Animation() {
    // animateNumber(document.querySelector(".yong-p-n"), 0, 100, 2000);
    // animateNumber(document.querySelector(".yong-d-n"), 0, 100, 2000);

    const yong = document.querySelector(".yong-p-bar");
    const yong2 = document.querySelector(".yong-d-bar");

    yong.style.setProperty('--fill', '100%');
    yong2.style.setProperty('--fill', '100%');
}

function startProject2Animation() {
    // animateNumber(document.querySelector(".dos-n"), 0, 100, 2000);

    const dos = document.querySelector(".dos-bar");

    dos.style.setProperty('--fill', '100%');
}

function startProject3Animation() {
    // animateNumber(document.querySelector(".hom-n"), 0, 100, 2000);

    const hom = document.querySelector(".hom-bar");

    hom.style.setProperty('--fill', '100%');
}

function startProject4Animation() {
    // animateNumber(document.querySelector(".mi-n"), 0, 50, 1000);
    // animateNumber(document.querySelector(".mi-n2"), 0, 100, 2000);

    const project4 = document.querySelector(".mi-p-bar");
    const project4d = document.querySelector(".mi-d-bar");

    project4.style.setProperty('--fill', '50%');
    project4d.style.setProperty('--fill', '100%');
}

function startProject5Animation() {
    // animateNumber(document.querySelector(".ven-n"), 0, 50, 1000);
    // animateNumber(document.querySelector(".ven-n2"), 0, 100, 2000);

    const project5 = document.querySelector(".venti-p-bar");
    const project5d = document.querySelector(".venti-d-bar");

    project5.style.setProperty('--fill', '50%');
    project5d.style.setProperty('--fill', '100%');
}

function startProject6Animation() {
    // animateNumber(document.querySelector(".st-n"), 0, 100, 2000);
    // animateNumber(document.querySelector(".st-n2"), 0, 70, 1500);

    const project6 = document.querySelector(".street-p-bar");
    const project6d = document.querySelector(".street-d-bar");

    project6.style.setProperty('--fill', '100%');
    project6d.style.setProperty('--fill', '70%');
}

function startProject7Animation() {
    // animateNumber(document.querySelector(".mayo-n"), 0, 100, 2000);

    const project7 = document.querySelector(".mayo-p-bar");

    project7.style.setProperty('--fill', '100%');
}

function startProject8Animation() {

    const project8 = document.querySelector(".every-p-bar");
    const project8d = document.querySelector(".every-d-bar");

    project8.style.setProperty('--fill', '50%');
    project8d.style.setProperty('--fill', '100%');
}

// 🟩 스킬 섹션 애니메이션 초기화 (스크롤 후 재모션을 위한 리셋)
function resetSkillsAnimation() {
    const ai = document.querySelector(".ai-bar");
    const ps = document.querySelector(".ps-bar");
    const xd = document.querySelector(".xd-bar");

    ai.style.setProperty('--fill', '0%');  // 초기값으로 리셋
    ps.style.setProperty('--fill', '0%');
    xd.style.setProperty('--fill', '0%');
}





// 🟩 페이지 새로 고침 시 스크롤을 맨 위로 이동
document.addEventListener("DOMContentLoaded", () => {
    // 페이지가 새로 고침되었는지 확인
    if (!sessionStorage.getItem('reload')) {
        // 새로 고침이 아니면 페이지 상단으로 이동
        window.scrollTo(0, 0);
        // 새로 고침 여부를 sessionStorage에 저장
        sessionStorage.setItem('reload', 'true');
    } else {
        // 새로 고침 후에는 sessionStorage를 초기화하여, 두 번째 새로 고침에서 상단으로 이동하지 않도록 설정
        sessionStorage.removeItem('reload');
    }
});

// 🟩 버튼 클릭 시 카테고리 섹션으로 스크롤 이동
document.querySelector('.ttt').addEventListener('click', function () {
    const categorySection = document.querySelector('.con02'); // 카테고리 섹션
    categorySection.scrollIntoView({ behavior: 'smooth' });  // 부드러운 스크롤로 카테고리 섹션으로 이동
});

// 🟩 스크롤 시 버튼 제어
document.addEventListener('scroll', function () {
    const tttButton = document.querySelector('.ttt');
    const categorySection = document.querySelector('.con02'); // 카테고리 섹션

    // 카테고리 섹션 이후부터 버튼 나타내기
    if (window.scrollY > categorySection.offsetTop) {
        tttButton.style.display = 'block'; // 버튼 보이기
    } else {
        tttButton.style.display = 'none'; // 버튼 숨기기
    }
});