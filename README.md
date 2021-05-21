# accessible-form

Um exemplo de formulário acessível e considerações sobre acessibilidade com HTML e JavaScript

## Características

** Verificação de CPF
* Busca automática de endereço a partir do CEP
* Máscara de preenchimento para valores numéricos
* Ao focalizar um campo, uma dica é exibida, indicando se o campo foi preenchido corretamente
* Se for feita uma tentativa de enviar o formulário com campos incompletos, preenchidos incorretamente  ou não preenchidos, uma mensagem amigável é exibida e o processo não prossegue
* Quando o usuário escolhe "Corrigir" na mensagem de aviso, o foco é transferido automaticamente para o campo com problema
* Tela de verificação dos dados que permite retornar ou prosseguir
* Página para os termos de serviço
* Página para a política de privacidade
* Página de conclusão

# Funcionamento

Um arquivo JSON descreve uma lista de todos os campos que devem ser exibidos no formulário, indicando, para cada campo 

* ID
* Legenda
* Preenchimento obrigatório
* Tipo de filtro a ser utilizado
* Máscara para campos numéricos
* Subitens para campos select

Após requisitar via XMLHttpRequest esta lista, um loop a percorre, criando objetos a partir de um conjunto de classes prefixadas por "filter".

Estes objetos produzem elementos HTML e os inserem no documento e mantêm controle sobre estes elementos.

Um outro conjunto de classes, prefixados por "frame", produz as páginas, permitindo a alternância entre o conteúdo.

## Acessibilidade com leitores de tela

O acesso com leitores de tela - que é meu caso - costuma ser pouco entendido pelos desenvolvedores, o que é perfeitamente compreensível.

Vamos abordar algumas questões bastante genéricas para em seguida aplicá-las ao nosso formulário.

## Compreenção de elementos isolados

As crianças que têm sorte, desde a infância estão habituadas a escutar leituras narradas pelos seus pais. Então não é difícil de imaginar que o acesso a um conteúdo através de narração sintetizada seja perfeitamente possível. Porém, quando interagimos com softwares, preenchemos formulários ou simplesmente navegamos pelas páginas de um site, o acesso ao conteúdo através de narração deixa de ser algo trivial.

Isso porque, ao escutar uma história, um poema ou uma idéia, normalmente a narrativa é organizada de maneira a ir compondo, passo-a-passo, uma imagem na mente do ouvinte. Por outro lado, quando estamos utilizando um software, preenchendo um formulário ou saltando de uma página para outra, a todo o instante saímos de uma construção linear de idéias e nos vemos dentro de um novo contexto, o qual precisa ser compreendido e relacionado com o todo restante.

Mesmo que pareça compreensível quando escutamos as opções de um menu, por exemplo "A organização, Serviços, Contato", observe que, se tomarmos o termo "Contato" isoladamente, precisamos descobrir a quem o termo "contato" se refere. Se escutarmos todos os itens do menu, fica claro que "Contato" se refere à organização em questão. Mas se dermos um comando para saltar de um item a outro e, de repente surgir "Contato" isoladamente, isto pode não ser óbvio. Imagine que, numa página, exista uma lista de autores e, para cada um, um item etiquetado por "Contato": inicialmente não é possível saber nem se este termo se refere ao nome antecessor ou ao nome posterior da lista. Talvez, navegando-se para o início da lista, podemos descobrir se o nome vem antes do termo "Contato" ou vice-versa.

Deste primeiro exemplo bastante simples, podemos começar a compreender os desafios de se criar um ambiente acessível através da leitura de tela.

Não basta que todos os elementos sejam descritos. É necessário que cada elemento seja compreensível se for tomado isoladamente.

### Organização espacial dos elementos

Embora inicialmente possa parecer estranho se organizar espacialmente os elementos para alguém que não enxerga, isso pode fazer uma grande diferença na compreenção do conteúdo narrado, já que nem sempre é possível ou mesmo confortável descrever longamente um elemento. Por isso, a descrição de elementos vizinhos pode ser de grande ajuda para se compreender um elemento isolado, inserindo-o dentro de um contexto.

Em uma tela sensível ao toque, é possível explorar uma região para descobrir a posição dos elementos. Em outros dispositivos podemos usar comandos do teclado para transferir o foco de um elemento a outro.

Dispositivos com teclado normalmente já oferecem alguns comandos para explorar uma página. Porém, é de suma importância que elementos interativos como menus, caixas combinadas, árvores, carrocéis, etc, permitam a navegação entre seus elementos internos de maneira intuitiva e consistente.

### Isolando contextos

Outro fator que ajuda muito no acesso narrado é o isolamento de um contexto.

Em programas de computador, podemos considerar uma caixa de diálogo como um contexto isolado. Podemos explorar o conteúdo da janela, eventualmente ler uma mensagem e encontrar alguns controles como botões e campos a serem preenchidos. Dentro de uma página Web, criar um contexto isolado exige conhecimento aprofundado das propriedades WAI-ARIA e normalmente muitos testes para se alcançar resultados adequados.

