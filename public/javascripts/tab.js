import {selector} from './api.js'

selector('#first-btn').addEventListener('click', event => {
    event.preventDefault()
    selector('#first-tab').classList.remove('active')
    selector('#second-tab').classList.add('active')
    selector('#first').classList.remove('show', 'active')
    selector('#second').classList.add('show', 'active')
})

selector('#second-btn-prev').addEventListener('click', event => {
    event.preventDefault()
    selector('#first-tab').classList.add('active')
    selector('#second-tab').classList.remove('active')
    selector('#first').classList.add('show', 'active')
    selector('#second').classList.remove('show', 'active')
})

selector('#second-btn-next').addEventListener('click', event => {
    event.preventDefault()
    selector('#second-tab').classList.remove('active')
    selector('#third-tab').classList.add('active')
    selector('#second').classList.remove('show', 'active')
    selector('#third').classList.add('show', 'active')
})

selector('#third-btn').addEventListener('click', event => {
    event.preventDefault()
    selector('#third-tab').classList.remove('active')
    selector('#second-tab').classList.add('active')
    selector('#third').classList.remove('show', 'active')
    selector('#second').classList.add('show', 'active')
})