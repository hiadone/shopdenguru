import React from "react";
import { Draggable } from "react-beautiful-dnd";

function Task(props) {
  return (
    <Draggable draggableId={this.props.task.id} index={this.props.index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {this.props.task.content[0]}
        </Container>
      )}
    </Draggable>
  );
}

export default Task;
