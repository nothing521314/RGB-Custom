deploy:
	ssh -p 2356 gameroot@103.170.207.189 "mkdir -p ~/RGB/admin"
	rsync -avhzL --delete \
				--no-perms --no-owner --no-group \
				--exclude .git \
				--exclude .logs \
				--exclude .tmp \
				--exclude .idea \
				--exclude docker \
				--exclude .env \
				--exclude .cache \
				--exclude .env.development \
				--exclude dist \
				--exclude package-lock.json \
				--exclude node_modules \
				. gameroot@103.170.207.189:~/RGB/admin
