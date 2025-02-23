import { b, h, hh } from 'deleight/dom/builder'

function item(placeholder: string) {
    return hh.div(
        h.input.set({ placeholder }),
        h.button.assign({ className: 'red no-print', innerHTML: '&#x2715;', onclick: (e: MouseEvent) => (e.target as Element).parentElement?.remove() })
    ).set({ class: 'd-flex ai-center jc-center' }).build()
}

function servedWith(value: string) {
    return h.input.set({ placeholder: 'ALL SERVED WITH...', class: 'bold red', value });
}

hh.div(
    hh.header(
        hh.h1("TODAY'S MENU")
    ).set({ class: 't-center' }),
    hh.article(
        hh.div(
            hh.section(
                hh.header(
                    h.img.set({ src: './images/burger.jpg', alt: 'Dinner photo', width: '100px', height: '100px', class: 'br50 left' }), 
                    hh.div(
                        hh.h2('DINNERS').set({ class: '' }), 
                        servedWith('SERVED WITH CHIPS, MASH OR VEG')
                    ).set({ class: 'd-grid t-center' })
                ).set({ class: 'd-grid cfr0 ai-center g2' }),
                hh.div(
                    hh.button('Add Dinner').set({ class: 'main no-print' }).assign({ onclick: (e: MouseEvent) => {
                        const btn = e.target as HTMLButtonElement;
                        btn.insertAdjacentElement('beforebegin', item('DINNER NAME'))
                     } })
                ).set({ class: 'd-grid ji-center t-center' })
            ).set({ class: 'd-grid g1 jc-center' }),
            hh.section(
                hh.header(
                    hh.div(
                        hh.h2('DESSERTS').set({ class: '' }), 
                        servedWith('SERVED WITH CREAM OR CUSTARD')
                    ).set({ class: 'd-grid t-center' }),
                    h.img.set({ src: './images/cake.jpg', alt: 'Dinner photo', width: '100px', height: '100px', class: 'br50 right' }), 
                ).set({ class: 'd-grid cfr0 ai-center g2' }),
                hh.div(
                    hh.button('Add Dessert').set({ class: 'main no-print' }).assign({ onclick: (e: MouseEvent) => {
                        const btn = e.target as HTMLButtonElement;
                        btn.insertAdjacentElement('beforebegin', item('DESSERT NAME'))
                     } })
                ).set({ class: 'd-grid ji-center t-center' })
            ).set({ class: 'd-grid g1 jc-center' })
        ).set({ class: 'd-grid g2 jc-center' })
    )
).appendTo(document.body)
