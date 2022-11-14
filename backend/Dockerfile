FROM golang:1.18.3-alpine

RUN mkdir /go/src/hajimete
COPY . /go/src/hajimete
WORKDIR /go/src/hajimete

RUN go install

RUN go get -u github.com/cosmtrek/air && \
    go build -o /go/bin/air github.com/cosmtrek/air

CMD ["air"]