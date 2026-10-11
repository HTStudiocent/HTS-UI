/* ============================================================
   HTS UI v1.0 JS · 无依赖组件行为层
   Author: HTStudiocent · 展示: https://www.haotis.top/ui/
   License: MIT

   用法：
     <script src="dist/hts-ui.js"></script>
     页面底部调用 HTSUI.init() 自动绑定全部组件；
     主题模块 HTSTheme 引入即可用（自动应用上次选择）。
   ============================================================ */
(function () {
    'use strict';

    /* ---------- 主题：浅色 / 深色 / 跟随系统 ---------- */
    var THEME_KEY = 'hts-theme';

    function getMode() {
        try {
            return localStorage.getItem(THEME_KEY) || 'system';
        } catch (e) {
            return 'system';
        }
    }

    function applyTheme() {
        var mode = getMode();
        var html = document.documentElement;
        if (mode === 'light' || mode === 'dark') {
            html.setAttribute('data-theme', mode);
        } else {
            html.removeAttribute('data-theme');
        }
    }

    function setMode(mode) {
        try {
            localStorage.setItem(THEME_KEY, mode);
        } catch (e) {}
        applyTheme();
        document.dispatchEvent(new Event('hts-theme-change'));
    }

    window.HTSTheme = {
        getMode: getMode,
        setMode: setMode,
        apply: applyTheme
    };
    applyTheme();

    /* ---------- Toast ---------- */
    var toastEl = null;
    var toastTimer = null;

    function toast(msg) {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'toast';
            document.body.appendChild(toastEl);
        }
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toastEl.classList.remove('show');
        }, 1800);
    }

    /* ---------- 开关 ---------- */
    function initSwitches(root) {
        root.querySelectorAll('.switch').forEach(function (sw) {
            if (sw.dataset.htsBound) return;
            sw.dataset.htsBound = '1';
            sw.addEventListener('click', function () {
                sw.classList.toggle('on');
            });
        });
    }

    /* ---------- 代码框：行号包裹 / 折叠展开 / 复制 ---------- */
    function wrapCodeLines(root) {
        root.querySelectorAll('.code-box pre > code').forEach(function (code) {
            if (code.querySelector('.code-line')) return;
            var lines = code.textContent.split('\n');
            code.textContent = '';
            lines.forEach(function (line) {
                var s = document.createElement('span');
                s.className = 'code-line';
                s.appendChild(document.createTextNode(line));
                code.appendChild(s);
            });
        });
    }

    function initCodeBoxes(root) {
        wrapCodeLines(root);

        root.querySelectorAll('.code-box').forEach(function (box) {
            var head = box.querySelector('.code-box-head');
            if (!head || head.dataset.htsBound) return;
            head.dataset.htsBound = '1';
            head.addEventListener('click', function (e) {
                if (e.target.classList.contains('code-copy')) return;
                box.classList.toggle('expanded');
            });
        });

        root.querySelectorAll('.code-copy').forEach(function (btn) {
            if (btn.dataset.htsBound) return;
            btn.dataset.htsBound = '1';
            btn.addEventListener('click', function () {
                var rows = btn.closest('.code-box').querySelectorAll('.code-line');
                var code = Array.prototype.map.call(rows, function (l) {
                    return l.textContent;
                }).join('\n');
                function done() {
                    var old = btn.textContent;
                    btn.textContent = '已复制';
                    setTimeout(function () { btn.textContent = old; }, 1200);
                }
                function fallback() {
                    var t = document.createElement('textarea');
                    t.value = code;
                    document.body.appendChild(t);
                    t.select();
                    document.execCommand('copy');
                    document.body.removeChild(t);
                    done();
                }
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code).then(done, fallback);
                } else {
                    fallback();
                }
            });
        });
    }

    /* ---------- 弹窗：data-hts-modal 声明式绑定 ----------
       触发：<button data-hts-modal="myModal">打开</button>
       结构：<div class="modal-mask" id="myModal"><div class="modal-box">
               <button class="modal-close">×</button> ... </div></div>
       关闭：× 按钮 / 遮罩点击 / ESC 均可 ---------- */
    function openModal(id) {
        var m = document.getElementById(id);
        if (m) m.classList.add('show');
    }

    function closeModal(id) {
        var m = document.getElementById(id);
        if (m) m.classList.remove('show');
    }

    function initModals(root) {
        root.querySelectorAll('[data-hts-modal]').forEach(function (btn) {
            if (btn.dataset.htsBound) return;
            btn.dataset.htsBound = '1';
            btn.addEventListener('click', function () {
                openModal(btn.getAttribute('data-hts-modal'));
            });
        });

        root.querySelectorAll('.modal-mask').forEach(function (mask) {
            if (mask.dataset.htsBound) return;
            mask.dataset.htsBound = '1';
            var closeBtn = mask.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function () {
                    mask.classList.remove('show');
                });
            }
            mask.addEventListener('click', function (e) {
                if (e.target === mask) mask.classList.remove('show');
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-mask.show').forEach(function (m) {
                    m.classList.remove('show');
                });
            }
        });
    }

    /* ---------- 侧边导航：桌面缩回 / 窄屏抽屉 ---------- */
    function initSideNav(root) {
        var wrap = root.querySelector('.ui-side-wrap');
        var side = root.querySelector('.ui-side');
        var btn = root.querySelector('.ui-side-toggle');
        var mask = root.querySelector('.ui-side-mask');
        if (!wrap || !side || !btn) return;

        function isNarrow() { return window.innerWidth <= 800; }

        function syncIcon() {
            btn.textContent = isNarrow()
                ? (wrap.classList.contains('open') ? '✕' : '☰')
                : (side.classList.contains('collapsed') ? '▶' : '◀');
        }

        function setDrawer(open) {
            wrap.classList.toggle('open', open);
            if (mask) mask.classList.toggle('show', open);
            document.body.classList.toggle('drawer-open', open);
            syncIcon();
        }

        btn.addEventListener('click', function () {
            if (isNarrow()) {
                setDrawer(!wrap.classList.contains('open'));
            } else {
                side.classList.toggle('collapsed');
                syncIcon();
            }
        });

        if (mask) {
            mask.addEventListener('click', function () { setDrawer(false); });
        }

        window.addEventListener('resize', syncIcon);
        syncIcon();

        /* 滚动自动高亮 */
        var links = root.querySelectorAll('.ui-side a[href^="#"]');
        var targets = [];
        links.forEach(function (l) {
            var t = document.querySelector(l.getAttribute('href'));
            if (t) targets.push({ link: l, block: t });
        });
        if ('IntersectionObserver' in window && targets.length) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (!en.isIntersecting) return;
                    targets.forEach(function (pair) {
                        pair.link.classList.toggle('active', pair.block === en.target);
                    });
                });
            }, { rootMargin: '-30% 0px -60% 0px' });
            targets.forEach(function (pair) { io.observe(pair.block); });
        }
    }

    /* ---------- 主题下拉框：select[data-hts-theme] 或 .theme-select ---------- */
    function initThemeSelects(root) {
        root.querySelectorAll('.theme-select').forEach(function (sel) {
            if (sel.dataset.htsBound) return;
            sel.dataset.htsBound = '1';
            sel.value = getMode();
            sel.addEventListener('change', function () {
                setMode(sel.value);
                document.querySelectorAll('.theme-select').forEach(function (other) {
                    if (other !== sel) other.value = sel.value;
                });
            });
        });
    }

    /* ---------- 一键初始化 ---------- */
    function init(root) {
        root = root || document;
        initSwitches(root);
        initCodeBoxes(root);
        initModals(root);
        initSideNav(root);
        initThemeSelects(root);
    }

    window.HTSUI = {
        init: init,
        toast: toast,
        openModal: openModal,
        closeModal: closeModal
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { init(); });
    } else {
        init();
    }
})();
