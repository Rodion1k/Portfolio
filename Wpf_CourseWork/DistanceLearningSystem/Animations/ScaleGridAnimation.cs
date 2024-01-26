using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Animation;

namespace DistanceLearningSystem.Animations
{
    public static class ScaleGridAnimation
    {
        public static void HorizontalScaleGrid(Grid grid, double from, double to, double duration)
        {
            DoubleAnimation buttonAnimation = new DoubleAnimation
            {
                From = @from,
                To = to,
                Duration = TimeSpan.FromSeconds(duration)
            };
            grid.BeginAnimation(FrameworkElement.WidthProperty, buttonAnimation);
        }

        public static void VerticalScaleGrid(Grid grid, double from, double to, double duration)
        {
            DoubleAnimation buttonAnimation = new DoubleAnimation
            {
                From = @from,
                To = to,
                Duration = TimeSpan.FromSeconds(duration)
            };
            grid.BeginAnimation(FrameworkElement.HeightProperty, buttonAnimation);
        }
    }
}