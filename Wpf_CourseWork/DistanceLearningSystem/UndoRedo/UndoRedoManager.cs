using System;
using System.Collections.Generic;

namespace DistanceLearningSystem.UndoRedo
{
    public class UndoRedoEventArgs
    {
        public int UndoCount { get; set; }
        public int RedoCount { get; set; }
    }

    public static class UndoRedoManager
    {
        private static readonly Stack<Action> UndoStack = new Stack<Action>();
        private static readonly Stack<Action> RedoStack = new Stack<Action>();

        public delegate void UndoRedoEventHandler(object sender, UndoRedoEventArgs e);

        public static event UndoRedoEventHandler UndoRedoChanged;
        public static int UndoCount => UndoStack.Count;

        public static void Add(Action action)
        {
            UndoStack.Push(action);
            RedoStack.Clear();
        }

        public static void Do(Action action)
        {
            if (UndoStack.Peek().Equals(action))
            {
                return;
            }

            action.Invoke();
            UndoStack.Push(action);
            RedoStack.Clear();
            UndoRedoChanged?.Invoke(null,
                new UndoRedoEventArgs() { UndoCount = UndoStack.Count, RedoCount = RedoStack.Count });
        }

        public static void ClearToIndex(int index)
        {
            while (UndoStack.Count > index)
            {
                UndoStack.Pop();
            }

            RedoStack.Clear();
            UndoRedoChanged?.Invoke(null,
                new UndoRedoEventArgs() { UndoCount = UndoStack.Count, RedoCount = RedoStack.Count });
        }

        public static void Undo()
        {
            var old = UndoStack.Pop();
            RedoStack.Push(old);
            var action = UndoStack.Peek();
            action.Invoke();
            UndoRedoChanged?.Invoke(null,
                new UndoRedoEventArgs() { UndoCount = UndoStack.Count, RedoCount = RedoStack.Count });
        }

        public static void Redo()
        {
            var action = RedoStack.Pop();
            UndoStack.Push(action);
            action.Invoke();
            UndoRedoChanged?.Invoke(null,
                new UndoRedoEventArgs() { UndoCount = UndoStack.Count, RedoCount = RedoStack.Count });
        }
    }
}