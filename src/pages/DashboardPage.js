import Page from '../js/core/Page';
import $ from '../js/core/dom';

export default class DashboardPage extends Page {
	getRoot() {
		const root = $.create('div', 'home').html(`
		<header class="home__header header-home">
			<div class="header-home__container">
				<h1 class="header-home__title">Excel Dashboard</h1>
			</div>
		</header>
		<main class="home__main main-home">
			<section class="main-home__buttons-section home-buttons-section">
				<div class="home-buttons-section__container">
					<a href="/excel" class="home-buttons-section__button">+</a>
				</div>
			</section>
			<section class="main-home__documents-section home-documents-section">
				<div class="home-documents-section__container">
					<header class="home-documents-section__header">
						<div class="home-documents-section__title">Title</div>
						<div class="home-documents-section__date">Last opening date</div>
					</header>
					<ul class="home-documents-section__documents">
						<li class="home-documents-section__document">
							<a href="/excel#228" class="home-documents-section__document-link">
								<div class="home-documents-section__document-title">My table</div>
								<time class="home-documents-section__document-date" datetime="2023-03-24">24.03.2023</time>
							</a>
						</li>
						<li class="home-documents-section__document">
							<a href="/fsdlhfsladfh" class="home-documents-section__document-link">
								<div class="home-documents-section__document-title">My second table</div>
								<time class="home-documents-section__document-date" datetime="2023-01-04">04.01.2023</time>
							</a>
						</li>
					</ul>
				</div>
			</section>
		</main>`);
		return root;
	}
}
