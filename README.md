# InternetSemLimites.github.io

Github pages code for the front-end only site for InternetSemLimites.

## Desenvolvimento/Contribuição

Se você deseja contribuir com o projeto, faça um fork do repositório e utilize o branch `develop`. Após realizar o checkout do branch, execute `npm install`, **é necessário tem *npm* instalado na sua máquina para este projeto**.

Para visualizar seu trabalho enquanto edita os arquivos, execute `npm run start`, isto fará com que o *Gulp* realize uma build de desenvolvimento e ative o *Browsersync* para que você possa ver suas mudanças sempre que salvar os arquivos.

Quando estiver satisfeito com as modificações, faça seu commit e *pull request* para que possamos adicionar suas mudanças ao site principal. Se desejar visualizar seu trabalho numa instância do *Github Pages* sob seu domínio, siga os passos abaixo.

## Deploy/Publicação

Como o gerador de sites do *ZURB Foundation 6* não possui suporte direto ao Github Pages, devemos fazer a publicação do site de forma manual.

Isto significa que se colocássemos todo o código no branch `gh-pages` como acontece com *Jekyll*, nenhuma página seria gerado.

Para que a publicação funcione são necessários os seguintes passos:
- Manter o código em um branch que não seja `gh-pages` (ou `master`, no caso de organizações)
- Executar o comando `npm run build` na raíz do repositório
- Enviar o código gerado pelo `build` para o Github num branch orfão chamado `gh-pages`. Veja os comandos necessários abaixo, **MUITA ATENÇÃO** para o parâmetro `--work-tree` nos commandos:
```sh
git --work-tree=dist checkout --orphan gh-pages

git --work-tree=dist add --all

git --work-tree=dist commit -m "Mensagem do commit"

git push origin gh-pages
```
