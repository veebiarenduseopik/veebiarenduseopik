// selectors
const chapterNavUl = document.querySelector(".chapter_nav_ul");
const chaptersChoose = document.querySelectorAll(".chapters_choose li");
const currentChapter = document.querySelector(".current_chapter");
const bookParagraph = document.querySelector('.book_paragraph');
const searchInput = document.querySelector('.search');

// fetching chapters from json 
async function fetchChapters(chapterId) {
    try{
        const response = await fetch(`chapters/chapter${chapterId.split('-')[0].replace('chapter', '')}.json`);
        if (!response.ok) throw new Error('failed to fetch');
        const chaptersData = await response.json();
        return Object.entries(chaptersData).map(([id,{title, content}])=>({id,title,content}));
    }catch (error){ console.error('errrr:', error.message); }
}

// add chapters' titles to navigation menu
function loadChapters(chapter, load) {
    fetchChapters(chapter).then(chapters => {
        chapterNavUl.innerHTML = chapters.map(({id,title}) =>
            `<li class="chapter_nav nav" data-chapter-id="${id}">
            <span class="chapter_nav-extra-text">${title}</span><span class="chapter_nav_line">
            </span><span class="chapter_nav_line-h">
            </span>
            </li>`
        ).join('');
        console.log(chapters)
       if (load) chapterNavUl.firstElementChild.classList.add("active");updateBookParagraph(chapters[0].content);currentChapter.innerHTML = chapters[0].title.substring(0,3)
    });
}

// insert chapter content to website
function updateBookParagraph(content) {
    bookParagraph.innerHTML = content;
    bookParagraph.scrollTop = 0;
    hljs.highlightAll(); 
}

// nav menu chapter topic click handling
chapterNavUl.addEventListener("click", (event) => {
    const chapterId = event.target.dataset.chapterId;
    swapColor(document.querySelectorAll('.chapter_nav_ul li'), event.target)
    if (chapterId) {
        fetchChapters(chapterId).then(chapters => {
            const index = chapterId.split('-')[1].replace('chapter', '') - 1;
            updateBookParagraph(chapters[index].content);
            currentChapter.innerHTML = chapters[index].title.substring(0,3)
            if (window.innerWidth <= 768) {
                document.querySelector(".book_navigation").classList.remove("active")
            }
            
        });
    }
});

// nav menu chapter number click handling
chaptersChoose.forEach(chapter => {
    chapter.addEventListener('click', (event) => {
        swapColor(event.target.parentElement.querySelectorAll("li"), event.target)
        loadChapters(chapter.innerHTML, true);
    });
});

// search text
async function searchTextInChapters(text) {
    let results = [];
    for (let i = 1; i <= 5; i++) {
        const chapters = await fetchChapters(i.toString());
        chapters.forEach(({ id, content }) => {
            if (content.toLowerCase().includes(text) && !results.includes(`${id}`)) {
                results.push(`${id}`);
            }
        });
    }
    if(results.length > 0) {
        console.log(results.join('\n'));
        document.querySelector(".search_results").innerHTML = results.map((result) =>
        `<li data-chapter-id="${result}">${result}</li>`
      ).join('')

    }
}

searchInput.addEventListener('change',(event) =>{
    const searchText = event.target.value.toLowerCase();
    if (searchText) {
        searchTextInChapters(searchText)
    }
});

// search results click handling
document.querySelector(".search_results").addEventListener("click",(event) => {
    const chapterId = event.target.dataset.chapterId;
    const chapterNum = chapterId.split('-')[0].replace('chapter', '')
    swapColor(document.querySelectorAll('.chapter_nav_ul li'), document.querySelectorAll('.chapter_nav_ul li')[chapterId.split('-')[1].replace('chapter', '') -1])
    swapColor(chaptersChoose, chaptersChoose[chapterNum-1])
    if (chapterId) {
        fetchChapters(chapterId).then(chapters => {
            const index = chapterId.split('-')[1].replace('chapter', '') -1;
            updateBookParagraph(chapters[index].content);
            currentChapter.innerHTML = chapters[index].title.substring(0,3)
        });
        openNav('.search_wrapper')
    }
});

// reading progress in percents
bookParagraph.addEventListener('scroll', (_event) => {
    const percentScrolled = Math.round(bookParagraph.scrollTop / (bookParagraph.scrollHeight - bookParagraph.offsetHeight) * 100);
    if (!isNaN(percentScrolled) && percentScrolled >= 0 && percentScrolled <= 100) {currentChapter.innerHTML = currentChapter.innerHTML.substring(0,3) + ` [${percentScrolled}%]`}
});

// load first chapter on website load
loadChapters("1", true);

// UIscripts

function swapColor(items, active){
    items.forEach(navItem => {
        navItem.classList.remove('active');
    });
    active.classList.add('active');
}

function openNav(elem){
    document.querySelector(elem).classList.toggle("active")
}

if (window.innerWidth >= 768) {
    document.querySelector(".book_navigation").classList.add("active")
}
