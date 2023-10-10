.PHONY: build
build:
	docker-compose build \
		--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
		--build-arg GIT_COMMIT=$(shell git rev-parse HEAD) \
		--push