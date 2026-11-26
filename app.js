(() => {
    const all = window.ANIME_CATALOGO || [];
    const page = document.body.dataset.page || 'tudo';
    const labels = { tudo: 'Todos os animes', completo: 'Animes completos', espera: 'Em espera', planejar: 'Planejar assistir' };
    const statuses = { completo: 'Completo', espera: 'Aguardando', planejar: 'Planejar assistir', 'sem-status': 'Na lista' };
    const list = document.querySelector('#anime-list');
    const search = document.querySelector('#search');
    const sort = document.querySelector('#sort');
    const count = document.querySelector('#result-count');
    const stored = JSON.parse(localStorage.getItem('anime-lista-status') || '{}');
    
    const data = all.map(item => ({ ...item, status: stored[item.arquivo] || item.status }));
    const counts = { tudo: data.length, completo: 0, espera: 0, planejar: 0 };
    data.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++ });
    document.querySelectorAll('[data-count]').forEach(el => { el.textContent = counts[el.dataset.count] });
    document.querySelector('#section-title').textContent = labels[page];
    function render() {
        let entries = data.filter(a => (page === 'tudo' || a.status === page) && a.titulo.toLocaleLowerCase('pt-BR').includes(search.value.trim().toLocaleLowerCase('pt-BR')));
        if (sort.value === 'az') entries.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
        if (sort.value === 'za') entries.sort((a, b) => b.titulo.localeCompare(a.titulo, 'pt-BR'));
        count.textContent = entries.length + ' anime' + (entries.length === 1 ? '' : 's') + ' encontrado' + (entries.length === 1 ? '' : 's');
        list.replaceChildren();
        if (!entries.length) { const e = document.createElement('div'); e.className = 'empty'; e.innerHTML = '<h3>Nenhum anime encontrado</h3><p>Esta categoria ainda não tem animes ou a pesquisa não encontrou resultados.</p>'; list.append(e); return }

        const frag = document.createDocumentFragment();
        entries.forEach(a => {
            const card = document.createElement('article'); card.className = 'anime-card';
            const wrap = document.createElement('div'); wrap.className = 'poster-wrap';
            const img = document.createElement('img'); img.className = 'poster'; img.loading = 'lazy'; img.src = 'anime_png/' + encodeURIComponent(a.arquivo); img.alt = 'Capa de ' + a.titulo;
            const badge = document.createElement('span'); badge.className = 'status ' + a.status; badge.textContent = statuses[a.status];
            const info = document.createElement('div'); info.className = 'card-info';
            const title = document.createElement('h3'); title.className = 'card-title'; title.textContent = a.titulo;
            wrap.append(img, badge); info.append(title); card.append(wrap, info); frag.append(card);
        }); list.append(frag);
    }
    
    search.addEventListener('input', render); sort.addEventListener('change', render);
    render();
})();
