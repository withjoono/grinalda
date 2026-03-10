import 'package:flutter/material.dart';
import 'package:turtle_planner/src/utils/constants/app_enums.dart';

class TitleInputWidget extends StatefulWidget {
  final String? initialValue;
  final String? placeholder;
  final InputSize size;
  final ValueChanged<String> onChanged;

  const TitleInputWidget({
    super.key,
    this.initialValue,
    this.placeholder,
    required this.size,
    required this.onChanged,
  });

  @override
  _TitleInputWidgetState createState() => _TitleInputWidgetState();
}

class _TitleInputWidgetState extends State<TitleInputWidget> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialValue);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    TextStyle getStyleForSize() {
      switch (widget.size) {
        case InputSize.sm:
          return theme.textTheme.titleMedium!;
        case InputSize.md:
          return theme.textTheme.titleLarge!;
        case InputSize.lg:
          return theme.textTheme.headlineSmall!;
      }
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        return Center(
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              final textStyle = getStyleForSize().copyWith(
                color: colorScheme.onSurface,
                fontWeight: FontWeight.normal,
              );

              // Calculate the width based on the current text or placeholder
              final textPainter = TextPainter(
                text: TextSpan(
                  text: _controller.text.isNotEmpty
                      ? _controller.text
                      : (widget.placeholder ?? ""),
                  style: textStyle,
                ),
                maxLines: 1,
                textDirection: TextDirection.ltr,
              )..layout(minWidth: 0, maxWidth: constraints.maxWidth);

              double width = textPainter.width + 16; // Add some padding

              return SizedBox(
                width: width,
                child: TextFormField(
                  controller: _controller,
                  style: textStyle,
                  textAlign: TextAlign.center,
                  cursorColor: colorScheme.primary,
                  decoration: InputDecoration(
                    hintText: widget.placeholder,
                    hintStyle: textStyle.copyWith(
                      color: colorScheme.onSurface.withOpacity(0.5),
                      fontWeight: FontWeight.normal,
                    ),
                    isDense: true,
                    contentPadding:
                        const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
                    border: InputBorder.none,
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(
                        color: colorScheme.onSurface.withOpacity(0.5),
                        width: 2,
                      ),
                    ),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(
                        color: colorScheme.primary,
                        width: 2,
                      ),
                    ),
                  ),
                  onChanged: (value) {
                    widget.onChanged(value);
                    setState(() {}); // Rebuild widget on text change
                  },
                ),
              );
            },
          ),
        );
      },
    );
  }
}
