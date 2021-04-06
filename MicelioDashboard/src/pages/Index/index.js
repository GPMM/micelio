import React from 'react';
import './style.css';

import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import FormCard from '../../Components/FormCard';
import FormFooter from '../../Components/FormFooter';

function Index() {
	return (
		<div className={'content-body'}>
			<Header title="Micelio"/>

			<div className={'container'}>
				<FormCard title="Faça Login">
					<input className={'primary'} type="text" name={'username'} placeholder={'Username'} />
					<input className={'primary'} type="password" name={'password'} placeholder={'Password'} />
					<button className={'primary'}>Entrar</button>
					<FormFooter beginingText='Não possui conta?' linkText='Cadastre-se' url='/sign'/>
				</FormCard>
			</div>

			<Footer />
		</div>
	)
}

export default Index;
