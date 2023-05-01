import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CreateQuestion from '../../components/CreateQuestion';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function GameQuest () {

    const history = useHistory();
    const params = useParams();

    const [btnReturn, setBtnReturn] = useState(false);
    const [btnContinue, setBtnContinue] = useState(false)

    const [questionList, setQuestionList] = useState([]);

    useEffect(() => {
        Api.get(`/gameQuest/${params.id}`).then(response => {
            const questions = response.data;
            if (questions.length < 1) {
                setQuestionList(['']);
            } else {
                setQuestionList(response.data);
            }
        });
    }, [params.id])

    const saveContent = async event => {
        event.preventDefault();

        try {
            for (let i=0;i<questionList.length;i++) {
                if (questionList[i] === '') {
                    toast.error(`Questão ${i+1} em branco. Por favor, delete ou insira dados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
                    return false;
                }
                const response = await Api.post(`/gameQuest/${params.id}`, {
                    question: questionList[i],
                    order: i,
                    length: questionList.length
                })

                if(!response.data.ok){
                    toast.error(`Não foi possível salvar os dados informados. Tente novamente`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
                }
            }
        }catch (e) {
            toast.error(`Não foi possível salvar os dados informados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }

        if (btnReturn) {
            history.push(`/gameLink/${params.id}`);
        }
        if (btnContinue) {
            history.push(`/videoLink/${params.id}`, {params: 'S'});
        }
    }

    const addQuestion = async () => {
        setQuestionList([...questionList, '']);
    }

    const changeQuestion = (value, index) => {   
        let newArrayQuestion = questionList;
        newArrayQuestion[index] = value;
        setQuestionList(newArrayQuestion);
    }

    const removeQuestion = (index) => {
        if (questionList.length === 1) {
            setQuestionList(['']);
        } else {
            let newArrayQuestion = [];
            questionList.splice(index, 1);
            for (let i=0;i<questionList.length;i++) {
                newArrayQuestion[i] = questionList[i];
            }
            setQuestionList(newArrayQuestion);
        }
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Criação de Experimento - Passo 2.5/6"/>
                <div className={'container'}>
                    <div>
                        <h2>
                            Criação do questionário específico do jogo.
                        </h2><br/>
                        <div>
                            <form name={'form01'} onSubmit={saveContent}>
                                <div>
                                    {questionList.map((question, index) => {
                                        return (
                                            <CreateQuestion key={index+questionList[index]}
                                                            index={index}
                                                            text={question}
                                                            onChangeFunction={changeQuestion}
                                                            onClickFunction={removeQuestion}
                                            />
                                        );
                                    })}
                                    <div className={'buttons'}>
                                        <AiOutlinePlusCircle className={'child-add'} size={35} onClick={addQuestion}/>
                                    </div><br/><br/>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className={'b-return'}><button className={'primary'} onClick={() => {setBtnReturn(true)}}>Retornar</button></td>
                                                <td className={'b-continue'}><button className={'primary'} onClick={() => {setBtnContinue(true)}}>Seguir</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    );
};

export default GameQuest;