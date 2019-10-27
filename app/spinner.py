import sys
from googletrans import Translator


class Spinner():

    lang = 'pt'
    text_old = ''
    text_new = ''
    friend_languages = {
        'pt': 'fr',
        'fr': 'pt',
        'en': 'es',
        'es': 'en',
    }


    def paraphrase_with_translation(self):
        translator = Translator()
        translation = translator.translate(self.text_old, dest=self.friend_languages[self.lang])
        paraphrased = translator.translate(translation.text, dest=self.lang)
        return paraphrased.text


    def spin(self, text, lang='pt'):
        self.text_old = text
        self.lang = lang
        self.text_new = self.paraphrase_with_translation()
        return self.text_new

'''
if __name__=="__main__":
    "Example of usage."

    text = 'A comissão especial que analisa a proposta de reforma da Previdência na Câmara dos Deputados inicia na tarde desta terça-feira (25) a discussão do relatório apresentado na semana passada pelo relator , deputado Arthur Maia (PPS-BA).\
Depois de fechar acordo com parlamentares da oposição, que tentavam obstruir a sessão de leitura do parecer do relator, o presidente da comissão da reforma da Previdência , deputado Carlos Marun (PMDB-MS), designou que todas as reuniões desta semana sejam para discutir o relatório e apresentar pedido de vista.\
O acordo com a oposição ainda definiu que a votação do relatório pelos membros da comissão deve ocorrer na próxima semana, dia 2 de maio. Já a partir do dia 8, o relatório estaria pronto para ser votado no plenário da Câmara dos Deputados. Para que isso aconteça, a equipe do governo Temer segue atuando para conquistar os votos necessários para aprovar as mudanças nas regras para a aposentadoria.\
Para reduzir a resistência à proposta, o Planalto aceitou flexibilizar alguns pontos do texto original, embora a maior parte das ideias iniciais tenha sido preservada.\
O relatório de Arthur Maia fixa a idade mínima de aposentadoria em 62 anos para as mulheres e em 65 anos para os homens após um período de transição de 20 anos. Ou seja, o aumento seria progressivo, começando em 53 e 55 anos, respectivamente, na data da promulgação da emenda.\
Para a aposentadoria por tempo de contribuição, o segurado terá que calcular quanto falta para se aposentar pelas regras atuais – 35 anos para o homem e 30 anos para a mulher – e adicionar um pedágio de 30%.\
Aí é só checar na tabela do aumento progressivo da idade, que começa em 53 anos para a mulher e 55 anos para o homem, e verificar qual idade mínima vai vigorar após este tempo. Pela tabela, a idade sobe um ano a cada dois anos a partir de 2020. Portanto, os 65 anos do homem só serão cobrados a partir de 2038.'

    lang='pt'

    spinner = Spinner()
    spinner.spin(text, lang)
    print(spinner.text_new)
'''
