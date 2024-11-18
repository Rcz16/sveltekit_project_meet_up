import App from './App.svelte';
import Header from './UI/Header.svelte';


const app = new App({
	// target: document.querySelector('#app')
	target: document.body
});
// const Header = new Header({
// 	target: document.querySelector('#head')
// });
export default app;