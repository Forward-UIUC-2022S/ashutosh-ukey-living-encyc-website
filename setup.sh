git submodule foreach "python3 -m venv env && . env/bin/activate && pip install -r requirements.txt && deactivate"

python3 -m venv env 
. env/bin/activate 

pip3 install nodeenv
nodeenv -p

cd node-api 
npm install 

cd .. 

cd react-app 
npm install