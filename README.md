# UNO | Challenge

Tecnologias:
[JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[NodeJs](https://nodejs.org/pt-br/docs)
[Graphql](https://graphql.org/learn/)
[React](https://pt-br.legacy.reactjs.org/docs/getting-started.html)

## Requisitos obrigatórios

 1. Deverá ser desenvolvido uma forma de editar os itens que já estão na lista.
 2. Deverá ser desenvolvido uma forma de remover os itens que estão na lista.
 3. Criar uma validação para não poder adicionar itens com o mesmo nome.
 4. Criar validação para não adicionar item com nome em branco / vazio.
 5. Poder filtrar os itens por nome.
 6. Todo método desenvolvido deverá ter documentação, explicando o que o mesmo está fazendo.

Lembrando que deverá seguir o padrão já pré-estabelecido no projeto na qual utiliza as chamadas para o backend com graphql.

## Requisitos opcionais

 1. Ajustar CSS e design para deixar a aplicação mais atraente.
 2. Criar outras ações que não foram pedidas acima.

 ## Outras ações implementadas além dos requisitos obrigatórios

1. **Ordenação dos itens**
   - Permite ordenar a lista por nome (A-Z/Z-A), prioridade (baixa→alta/alta→baixa) e status (completas/incompletas).
   - Implementado com menu de ordenação e integração backend/frontend.

2. **Marcar todos como concluído**
   - Botão para marcar todas as tarefas como concluídas de uma vez.
   - Inclui dialog de confirmação para evitar ações acidentais.

3. **Limpar todas as tarefas**
   - Botão para remover todas as tarefas da lista de uma vez.
   - Inclui dialog de confirmação para evitar exclusão acidental.

4. **Feedback visual com Tooltips**
   - Tooltips explicativos nos botões de ação para melhor experiência do usuário

5. **Confirmação visual para exclusão de item**
   - Dialog de confirmação ao tentar excluir uma tarefa individual, evitando exclusão acidental.

6. **Notificações (toasts) para ações**
   - Exibe mensagens de sucesso ou erro ao adicionar, editar, remover ou realizar ações em lote.

7. **Filtro por prioridade**
   - Permite filtrar tarefas por prioridade (baixa, média, alta).

8. **Filtro por status de conclusão**
   - Possibilidade de filtrar tarefas completas ou incompletas.

9. **Validação de nome duplicado e vazio também no backend**
   - Assegura integridade dos dados mesmo em chamadas diretas à API.
   - Utilização de validação com Joi para garantir regras de negócio no backend.

10. **Dark Mode**
    - Possibilidade de alternar entre o modo light e dark.

11. **Otimização do contexto de tarefas**
    - Uso de `useMemo` para evitar re-renderizações desnecessárias dos consumidores do contexto.

12. **Debounce no filtro de nome**
    - Reduz requisições ao backend ao filtrar por nome, melhorando performance.

13. **Design responsivo e melhorias visuais**
    - Ajustes de CSS para melhor experiência em diferentes tamanhos de tela e temas.

14. **Testes automatizados**
    - Estrutura inicial de testes com Jest e React Testing Library para componentes e hooks principais.
    - Exemplos de testes unitários e de integração para garantir o funcionamento das principais funcionalidades.

15. **Tratamento de erros e UX**
    - Mensagens de erro amigáveis para o usuário em casos de falha de rede, duplicidade ou campos obrigatórios.
    - Feedback visual imediato para ações do usuário.

16. **Código limpo e documentado**
    - Componentes e funções documentados com comentários explicativos.
    - Organização de pastas e arquivos seguindo boas práticas de projetos React.

17. **Hooks customizados**
    - Uso de hooks customizados como `useDebounce` para otimizar performance e experiência do usuário.

18. **Contextos desacoplados**
    - Separação dos contextos de tarefas, notificações e tema para melhor escalabilidade e manutenção do código.

19. **Experiência de usuário aprimorada**
    - Animações com Framer Motion para transições suaves na lista de tarefas.
    - Placeholders e mensagens para listas vazias.

## Como rodar o projeto?

Você deverá entrar dentro da pasta `frontend` e rodar o comando `yarn` ou `npm install`. (Lembre se de instalar o [Nodejs](https://nodejs.org/en/download)) em seu computador.

Após ter instalado as dependências com o comando acima, você deverá rodar o comando `yarn start` ainda dentro da pasta frontend, isso irá fazer com que seu frontend suba em `http://localhost:3000`.

Para a pasta serverless deverá ser feito os mesmos passos acima descritos, porém o backend estará rodando `http://localhost:4000/graphql`

## Environments Variables
  
Na pasta do frontend crie o arquivo .env caso não existir com o seguinte conteúdo abaixo.
##### **`.env`**
```
REACT_APP_GRAPHQL_URI=http://localhost:4000/graphql
```

## Como apresentar o projeto?

Esse projeto deverá ser feito um fork dele, que já irá aparecer em seu github para que você nos envie e possamos baixar para analisar o código desenvolvido. 

Lembre-se de deixar seu repositório público.
