MY_SESSION=$(tmux list-sessions | grep "poketools")
if [[ ! $MY_SESSION ]]; then
		# create a new session and `-d`etach
		tmux new-session -d -s poketools
		tmux new-window
		tmux send "npm start"
fi
tmux attach-session -d -t poketools
