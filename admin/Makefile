deploy:
	ssh ubuntu@18.141.146.62 "mkdir -p /home/ubuntu/RGB"
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
				--exclude node_modules \
				. ubuntu@18.141.146.62:/home/ubuntu/RGB/RGB-admin
