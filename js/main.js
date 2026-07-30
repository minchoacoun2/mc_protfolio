const sections = [...document.querySelectorAll(".section")];
const revealItems = document.querySelectorAll(".reveal");
const indexSection = document.querySelector(".index-section");

let currentIndex = 0;
let scrolling = false;
let touchStartY = 0;

/* 일반 섹션 등장 */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
    });
  },
  {
    threshold: 0.3
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

/* 목차 순차 등장 */

if (indexSection) {
  const indexObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
      });
    },
    {
      threshold: 0.35
    }
  );

  indexObserver.observe(indexSection);
}

/* 목차 및 내부 링크 */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const selector = link.getAttribute("href");

    if (!selector || selector === "#") {
      event.preventDefault();
      return;
    }

    const target = document.querySelector(selector);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

/* 현재 섹션 찾기 */

function findCurrentSection() {
  const viewportCenter = window.scrollY + window.innerHeight / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  sections.forEach((section, index) => {
    const center =
      section.offsetTop + section.offsetHeight / 2;

    const distance = Math.abs(viewportCenter - center);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

/* 한 섹션씩 이동 */

function moveSection(index) {
  if (index < 0 || index >= sections.length) return;

  currentIndex = index;
  scrolling = true;

  sections[index].scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  window.setTimeout(() => {
    scrolling = false;
  }, 1200);
}

/* 마우스 휠 */

window.addEventListener(
  "wheel",
  (event) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth <= 700
    ) {
      return;
    }

    if (Math.abs(event.deltaY) < 25) return;

    event.preventDefault();

    if (scrolling) return;

    currentIndex = findCurrentSection();

    if (event.deltaY > 0) {
      moveSection(
        Math.min(currentIndex + 1, sections.length - 1)
      );
    } else {
      moveSection(
        Math.max(currentIndex - 1, 0)
      );
    }
  },
  {
    passive: false
  }
);

/* 키보드 */

window.addEventListener("keydown", (event) => {
  const nextKeys = ["ArrowDown", "PageDown"];
  const previousKeys = ["ArrowUp", "PageUp"];

  if (
    !nextKeys.includes(event.key) &&
    !previousKeys.includes(event.key)
  ) {
    return;
  }

  if (scrolling) return;

  event.preventDefault();
  currentIndex = findCurrentSection();

  if (nextKeys.includes(event.key)) {
    moveSection(
      Math.min(currentIndex + 1, sections.length - 1)
    );
  }

  if (previousKeys.includes(event.key)) {
    moveSection(
      Math.max(currentIndex - 1, 0)
    );
  }
});

/* 모바일 터치 */

window.addEventListener(
  "touchstart",
  (event) => {
    touchStartY = event.touches[0].clientY;
  },
  {
    passive: true
  }
);

window.addEventListener(
  "touchend",
  (event) => {
    const touchEndY = event.changedTouches[0].clientY;
    const difference = touchStartY - touchEndY;

    if (
      Math.abs(difference) < 80 ||
      scrolling ||
      window.innerWidth <= 700
    ) {
      return;
    }

    currentIndex = findCurrentSection();

    if (difference > 0) {
      moveSection(
        Math.min(currentIndex + 1, sections.length - 1)
      );
    } else {
      moveSection(
        Math.max(currentIndex - 1, 0)
      );
    }
  },
  {
    passive: true
  }
);

window.addEventListener("load", () => {
  currentIndex = findCurrentSection();
});

/* 메인 제목: 한 글자씩 천천히 번지며 한 번만 등장 */

const heroTitle = document.querySelector(".hero-title");

if (heroTitle) {
  const heroLines = heroTitle.querySelectorAll("h1, p");
  let characterIndex = 0;

  heroLines.forEach((line, lineIndex) => {
    const text = line.textContent.trim();
    line.textContent = "";

    [...text].forEach((character) => {
      const span = document.createElement("span");
      span.className = "hero-char";
      span.textContent = character;
      span.style.setProperty("--char-index", characterIndex);
      line.appendChild(span);
      characterIndex += 1;
    });

    /* DESIGN 다음 PORTFOLIO가 시작되기 전 아주 짧은 간격 */
    if (lineIndex === 0) {
      characterIndex += 2;
    }
  });

  heroTitle.classList.add("is-running");
}

/* TOP 버튼 */

const topButton = document.querySelector(".top-button");

if (topButton) {
  function updateTopButton() {
    topButton.classList.toggle(
      "is-visible",
      window.scrollY > window.innerHeight * 0.75
    );
  }

  window.addEventListener("scroll", updateTopButton, {
    passive: true
  });

  topButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  updateTopButton();
}
