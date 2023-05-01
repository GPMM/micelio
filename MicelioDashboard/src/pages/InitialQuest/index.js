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

function InitialQuest () {

    const history = useHistory();
    const params = useParams();

    const [btnReturn, setBtnReturn] = useState(false);
    const [btnContinue, setBtnContinue] = useState(false)

    const [questionList, setQuestionList] = useState([]);

    let hasOption = false;

    useEffect(() => {
        Api.get(`/initialQuest/${params.id}`).then(response => {
            const questions = response.data;
            if (questions.length < 1) {
                setQuestionList([{txt_question: '', ind_type: 'D', options: ['']}]);
            } else {
                setQuestionList(response.data.questions);
            }
        });
    }, [params.id])

    const saveContent = async event => {
        event.preventDefault();

        try {
            for (let i=0;i<questionList.length;i++) {
                if (questionList[i] === '') {
                    toast.error(`Questão ${i+1} em branco. Por favor, delete ou insira dados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}});
                    return false;
                }
                const response = await Api.post(`/initialQuest/${params.id}`, {
                    question: questionList[i].txt_question,
                    order: i,
                    length: questionList.length,
                    hasOption: questionList[i].ind_type,
                    options: questionList[i].options
                })

                if(!response.data.ok){
                    toast.error(`Não foi possível salvar os dados informados. Tente novamente`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
                }
            }
        }catch (e) {
            toast.error(`Não foi possível salvar os dados informados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }

        if (btnReturn) {
            history.push(`/videoLink/${params.id}`);
        }
        if (btnContinue) {
            history.push(`/specQuest/${params.id}`);
        }
    }

    const addQuestion = () => {
        setQuestionList([...questionList, {txt_question: '', ind_type: 'D', options: ['']}]);
    }

    const changeQuestion = (value, index) => {   
        let newArrayQuestion = questionList;
        newArrayQuestion[index].txt_question = value;
        setQuestionList(newArrayQuestion);
    }

    const removeQuestion = index => {
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

    const includeOptions = index => {
        let newArrayQuestion = questionList;
        if(newArrayQuestion[index].ind_type === 'D') {
            newArrayQuestion[index].ind_type = 'O';
        } else {
            newArrayQuestion[index].ind_type = 'D';
        }
        setQuestionList(newArrayQuestion);
    }

    const addOption = index => {
        let newArrayQuestion = questionList;
        newArrayQuestion[index].options.push('');
        setQuestionList(newArrayQuestion);
    }

    const changeOption = (value, questIndex, optionIndex) => {
        let newArrayQuestion = questionList;
        newArrayQuestion[questIndex].options[optionIndex] = value;
        setQuestionList(newArrayQuestion);
    }

    const removeOption = (questIndex, optionIndex) => {
        let newArrayQuestion = questionList;
        if (newArrayQuestion[questIndex].options.length > 1) {
            newArrayQuestion[questIndex].options.splice(optionIndex, 1);
        } else {
            newArrayQuestion[questIndex].options = [''];
        }
        setQuestionList(newArrayQuestion);
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Criação de Experimento - Passo 4/6"/>
                <div className={'container'}>
                    <div>
                        <h2>
                            Cria&ccedil;&atilde;o do question&aacute;rio inicial.
                        </h2><br/>
                        <div>
                            <form name={'form01'} onSubmit={saveContent}>
                                <div>
                                    {questionList.map((question, index) => {
                                        if (question.ind_type === 'O') {
                                            hasOption = true;
                                        } else {
                                            hasOption = false;
                                        }
                                        return (
                                            <CreateQuestion key={index+questionList[index]}
                                                            index={index}
                                                            text={question.txt_question}
                                                            hasOption={hasOption}
                                                            optionsList={question.options}
                                                            onChangeFunction={changeQuestion}
                                                            onChangeFuncOpt={changeOption}
                                                            onClickFunction={removeQuestion}
                                                            onClickFuncOpt={includeOptions}
                                                            onClickAddOpt={addOption}
                                                            onClickRemoveOpt={removeOption}
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

export default InitialQuest;