deploy:
	ssh -p 2356 gameroot@103.170.207.189 "mkdir -p ~/RGB/backend"
	rsync -avhzL --delete \
				--no-perms --no-owner --no-group \
				--exclude .git \
				--exclude .logs \
				--exclude .tmp \
				--exclude .idea \
				--exclude docker \
				--exclude .env \
				--exclude .env.development \
				--exclude dist \
				--exclude package-lock.json \
				--exclude node_modules \
				--exclude public \
				. gameroot@103.170.207.189:~/RGB/backend
