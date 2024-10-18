# Define a function to run commands and keep the session alive
run_command() {
    "$@" || { echo "$@ failed"; sleep 1; }
}

# Define a function to run the filtered watch command
run_hyprctl_watch() {
    watch -twn 1.0 'hyprctl clients | grep -E "(Window|workspace:|class:|pid:|xwayland:|fullscreen:)" | awk '\''BEGIN {block=""; skip=0;} /^Window/ {if (block != "" && skip == 0) {print block} block=$0; skip=0; next} {block = block "\n" $0; if ($0 ~ /scratch/) {skip=1}} END {if (block != "" && skip == 0) {print block}}'\'''
}

# Export the functions to make them available in subshells
export -f run_command
export -f run_hyprctl_watch

# Launch tmux session
tmux new-session -d -s monitor -n 'btop' "bash -c 'run_command btop'"
tmux new-window -t monitor:1 -n 'nvidia_smi' "bash -c 'run_command watch -n 1.0 nvidia-smi'"
tmux new-window -t monitor:2 -n 'hyprctl' "bash -c 'run_hyprctl_watch'"
tmux new-window -t monitor:3 -n 'custom' 

# Attach to the session
tmux attach-session -t monitor
