/* */ 
System.register(['typescript', './logger', './utils', "./compiler-host"], function(exports_1) {
    var ts, logger_1, utils_1, compiler_host_1;
    var logger, TypeChecker;
    return {
        setters:[
            function (ts_1) {
                ts = ts_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (compiler_host_1_1) {
                compiler_host_1 = compiler_host_1_1;
            }],
        execute: function() {
            logger = new logger_1.default({ debug: false });
            TypeChecker = (function () {
                function TypeChecker(host) {
                    this._host = host;
                    this._options = ts.clone(this._host.options);
                    this._options.inlineSourceMap = false;
                    this._options.sourceMap = false;
                    this._options.declaration = false;
                    this._options.isolatedModules = false;
                    this._options.skipDefaultLibCheck = true;
                }
                TypeChecker.prototype.check = function () {
                    var candidates = this.getCandidates();
                    if (candidates.some(function (candidate) { return candidate.checkable; }))
                        return this.getAllDiagnostics(candidates);
                    else
                        return [];
                };
                TypeChecker.prototype.forceCheck = function () {
                    var files = this._host.getAllFiles()
                        .filter(function (file) { return file.fileName != compiler_host_1.__HTML_MODULE__; });
                    var unchecked = files.filter(function (file) { return !file.checked; });
                    var errored = files.filter(function (file) { return file.checked && utils_1.hasError(file.errors); });
                    if ((errored.length > 0) || (unchecked.length > 0)) {
                        return [{
                                file: undefined,
                                start: undefined,
                                length: undefined,
                                code: 9999,
                                category: ts.DiagnosticCategory.Error,
                                messageText: "compilation failed [" + files.length + " files, " + errored.length + " failed, " + unchecked.length + " unchecked]"
                            }];
                    }
                    return [];
                };
                TypeChecker.prototype.getCandidates = function () {
                    var _this = this;
                    var candidates = this._host.getAllFiles()
                        .filter(function (file) { return file.fileName != compiler_host_1.__HTML_MODULE__; })
                        .map(function (file) { return ({
                        name: file.fileName,
                        file: file,
                        seen: false,
                        resolved: !!file.dependencies,
                        checkable: undefined,
                        deps: file.dependencies && file.dependencies.list
                    }); });
                    var candidatesMap = candidates.reduce(function (result, candidate) {
                        result[candidate.name] = candidate;
                        return result;
                    }, {});
                    candidates.forEach(function (candidate) { return candidate.checkable = _this.isCheckable(candidate, candidatesMap); });
                    return candidates;
                };
                TypeChecker.prototype.isCheckable = function (candidate, candidatesMap) {
                    var _this = this;
                    if (!candidate)
                        return false;
                    else {
                        if (!candidate.seen) {
                            candidate.seen = true;
                            candidate.checkable = candidate.resolved && candidate.deps.every(function (dep) { return _this.isCheckable(candidatesMap[dep], candidatesMap); });
                        }
                        return (candidate.checkable !== false);
                    }
                };
                TypeChecker.prototype.getAllDiagnostics = function (candidates) {
                    var filelist = candidates.map(function (dep) { return dep.name; }).concat([compiler_host_1.__HTML_MODULE__]);
                    var program = ts.createProgram(filelist, this._options, this._host);
                    return candidates.reduce(function (errors, candidate) {
                        if (candidate.checkable && !candidate.file.checked) {
                            candidate.file.errors = [];
                            if (!candidate.file.isLibFile) {
                                candidate.file.errors = program.getSyntacticDiagnostics(candidate.file)
                                    .concat(program.getSemanticDiagnostics(candidate.file));
                            }
                            candidate.file.checked = true;
                            return errors.concat(candidate.file.errors);
                        }
                        else {
                            return errors;
                        }
                    }, program.getGlobalDiagnostics());
                };
                return TypeChecker;
            })();
            exports_1("TypeChecker", TypeChecker);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS1jaGVja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3R5cGUtY2hlY2tlci50cyJdLCJuYW1lcyI6WyJUeXBlQ2hlY2tlciIsIlR5cGVDaGVja2VyLmNvbnN0cnVjdG9yIiwiVHlwZUNoZWNrZXIuY2hlY2siLCJUeXBlQ2hlY2tlci5mb3JjZUNoZWNrIiwiVHlwZUNoZWNrZXIuZ2V0Q2FuZGlkYXRlcyIsIlR5cGVDaGVja2VyLmlzQ2hlY2thYmxlIiwiVHlwZUNoZWNrZXIuZ2V0QWxsRGlhZ25vc3RpY3MiXSwibWFwcGluZ3MiOiI7O1FBT00sTUFBTTs7Ozs7Ozs7Ozs7Ozs7OztZQUFOLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQWE1QztnQkFJQ0EscUJBQVlBLElBQWtCQTtvQkFDN0JDLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO29CQUVkQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFTQSxFQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtvQkFDeERBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLGVBQWVBLEdBQUdBLEtBQUtBLENBQUNBO29CQUN0Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0E7b0JBQ2hDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQTtvQkFDbENBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLGVBQWVBLEdBQUdBLEtBQUtBLENBQUNBO29CQUN0Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsbUJBQW1CQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDMUNBLENBQUNBO2dCQUtNRCwyQkFBS0EsR0FBWkE7b0JBQ0tFLElBQU1BLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLGFB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QSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTt3QkFDckRBLENBQUNBO3dCQUNLQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDSEEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7d0JBQ2pCQSxDQUFDQTtvQkFDUkEsQ0FBQ0EsRUFBRUEsT0FBT0EsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxDQUFDQSxDQUFDQTtnQkFDcENBLENBQUNBO2dCQUNGTixrQkFBQ0E7WUFBREEsQ0FBQ0EsQUE3R0QsSUE2R0M7WUE3R0QscUNBNkdDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7aGFzRXJyb3J9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtDb21waWxlckhvc3QsIENvbWJpbmVkT3B0aW9ucywgU291cmNlRmlsZX0gZnJvbSAnLi9jb21waWxlci1ob3N0JztcbmltcG9ydCB7X19IVE1MX01PRFVMRV9ffSBmcm9tIFwiLi9jb21waWxlci1ob3N0XCI7XG5cbmNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoeyBkZWJ1ZzogZmFsc2UgfSk7XG5cbnR5cGUgQ2FuZGlkYXRlID0ge1xuICAgbmFtZTogc3RyaW5nO1xuICAgZmlsZTogU291cmNlRmlsZTsgICBcbiAgIHNlZW46IGJvb2xlYW47XG4gICByZXNvbHZlZDogYm9vbGVhbjtcbiAgIGRlcHM6IHN0cmluZ1tdO1xuICAgY2hlY2thYmxlOiBib29sZWFuO1xufVxuXG50eXBlIENhbmRpZGF0ZU1hcCA9IHsgW3M6IHN0cmluZ106IENhbmRpZGF0ZSB9O1xuXG5leHBvcnQgY2xhc3MgVHlwZUNoZWNrZXIge1xuXHRwcml2YXRlIF9ob3N0OiBDb21waWxlckhvc3Q7XG4gICBwcml2YXRlIF9vcHRpb25zOiBDb21iaW5lZE9wdGlvbnM7XG5cblx0Y29uc3RydWN0b3IoaG9zdDogQ29tcGlsZXJIb3N0KSB7XG5cdFx0dGhpcy5faG9zdCA9IGhvc3Q7XG5cbiAgICAgIHRoaXMuX29wdGlvbnMgPSAoPGFueT50cykuY2xvbmUodGhpcy5faG9zdC5vcHRpb25zKTtcblx0XHR0aGlzLl9vcHRpb25zLmlubGluZVNvdXJjZU1hcCA9IGZhbHNlO1xuXHRcdHRoaXMuX29wdGlvbnMuc291cmNlTWFwID0gZmFsc2U7XG5cdFx0dGhpcy5fb3B0aW9ucy5kZWNsYXJhdGlvbiA9IGZhbHNlO1xuXHRcdHRoaXMuX29wdGlvbnMuaXNvbGF0ZWRNb2R1bGVzID0gZmFsc2U7XG5cdFx0dGhpcy5fb3B0aW9ucy5za2lwRGVmYXVsdExpYkNoZWNrID0gdHJ1ZTsgLy8gZG9uJ3QgY2hlY2sgdGhlIGRlZmF1bHQgbGliIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2Vcblx0fVxuXG5cdC8qXG5cdFx0cmV0dXJucyBhIHByb21pc2UgdG8gYW4gYXJyYXkgb2YgdHlwZXNjcmlwdCBlcnJvcnMgZm9yIHRoaXMgZmlsZVxuXHQqL1xuXHRwdWJsaWMgY2hlY2soKTogdHMuRGlhZ25vc3RpY1tdIHsgICAgICAgICBcbiAgICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSB0aGlzLmdldENhbmRpZGF0ZXMoKTtcbiAgICAgIGlmIChjYW5kaWRhdGVzLnNvbWUoY2FuZGlkYXRlID0+IGNhbmRpZGF0ZS5jaGVja2FibGUpKSAgICAgICAgICAgIFxuICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWxsRGlhZ25vc3RpY3MoY2FuZGlkYXRlcyk7IFxuICAgICAgZWxzZVxuICAgICAgICAgcmV0dXJuIFtdO1xuXHR9XG5cblx0Lypcblx0XHR0aHJvd3MgaWYgdGhlcmUgYXJlIGNvbXBpbGVyIGVycm9ycyBvciB1bnJlc29sdmVkIGZpbGVzXG5cdCovXG5cdHB1YmxpYyBmb3JjZUNoZWNrKCk6IHRzLkRpYWdub3N0aWNbXSB7XG4gICAgICBjb25zdCBmaWxlcyA9IHRoaXMuX2hvc3QuZ2V0QWxsRmlsZXMoKVxuICAgICAgICAgLmZpbHRlcihmaWxlID0+IGZpbGUuZmlsZU5hbWUgIT0gX19IVE1MX01PRFVMRV9fKTtcbiAgICAgIGNvbnN0IHVuY2hlY2tlZCA9IGZpbGVzLmZpbHRlcihmaWxlID0+ICFmaWxlLmNoZWNrZWQpO1xuICAgICAgY29uc3QgZXJyb3JlZCA9IGZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUuY2hlY2tlZCAmJiBoYXNFcnJvcihmaWxlLmVycm9ycykpO1xuICAgICAgXG4gICAgICBpZiAoKGVycm9yZWQubGVuZ3RoID4gMCkgfHwgKHVuY2hlY2tlZC5sZW5ndGggPiAwKSkge1xuICAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICBmaWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzdGFydDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgbGVuZ3RoOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBjb2RlOiA5OTk5LFxuICAgICAgICAgICAgY2F0ZWdvcnk6IHRzLkRpYWdub3N0aWNDYXRlZ29yeS5FcnJvcixcbiAgICAgICAgICAgIG1lc3NhZ2VUZXh0OiBgY29tcGlsYXRpb24gZmFpbGVkIFske2ZpbGVzLmxlbmd0aH0gZmlsZXMsICR7ZXJyb3JlZC5sZW5ndGh9IGZhaWxlZCwgJHt1bmNoZWNrZWQubGVuZ3RofSB1bmNoZWNrZWRdYFxuICAgICAgICAgfV07XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiBbXTsgXG5cdH1cblxuICAgcHJpdmF0ZSBnZXRDYW5kaWRhdGVzKCkge1xuICAgICAgY29uc3QgY2FuZGlkYXRlcyA9IHRoaXMuX2hvc3QuZ2V0QWxsRmlsZXMoKVxuICAgICAgICAgLmZpbHRlcihmaWxlID0+IGZpbGUuZmlsZU5hbWUgIT0gX19IVE1MX01PRFVMRV9fKVxuICAgICAgICAgLm1hcChmaWxlID0+ICh7XG4gICAgICAgICAgICBuYW1lOiBmaWxlLmZpbGVOYW1lLFxuICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgIHNlZW46IGZhbHNlLFxuICAgICAgICAgICAgcmVzb2x2ZWQ6ICEhZmlsZS5kZXBlbmRlbmNpZXMsXG4gICAgICAgICAgICBjaGVja2FibGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRlcHM6IGZpbGUuZGVwZW5kZW5jaWVzICYmIGZpbGUuZGVwZW5kZW5jaWVzLmxpc3RcbiAgICAgICAgIH0pKTtcbiAgICAgIFxuICAgICAgY29uc3QgY2FuZGlkYXRlc01hcCA9IGNhbmRpZGF0ZXMucmVkdWNlKChyZXN1bHQsIGNhbmRpZGF0ZSkgPT4ge1xuICAgICAgICAgcmVzdWx0W2NhbmRpZGF0ZS5uYW1lXSA9IGNhbmRpZGF0ZTtcbiAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9LCB7fSBhcyBDYW5kaWRhdGVNYXApO1xuICAgICAgXG4gICAgICBjYW5kaWRhdGVzLmZvckVhY2goY2FuZGlkYXRlID0+IGNhbmRpZGF0ZS5jaGVja2FibGUgPSB0aGlzLmlzQ2hlY2thYmxlKGNhbmRpZGF0ZSwgY2FuZGlkYXRlc01hcCkpO1xuICAgICAgcmV0dXJuIGNhbmRpZGF0ZXM7XG4gICB9XG4gICBcbiAgIHByaXZhdGUgaXNDaGVja2FibGUoY2FuZGlkYXRlOiBDYW5kaWRhdGUsIGNhbmRpZGF0ZXNNYXA6IENhbmRpZGF0ZU1hcCk6IGJvb2xlYW4ge1xuICAgICAgaWYgKCFjYW5kaWRhdGUpXG4gICAgICAgICByZXR1cm4gZmFsc2U7ICAgICAgXG4gICAgICBlbHNlIHtcbiAgICAgICAgIGlmICghY2FuZGlkYXRlLnNlZW4pIHtcbiAgICAgICAgICAgIGNhbmRpZGF0ZS5zZWVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGNhbmRpZGF0ZS5jaGVja2FibGUgPSBjYW5kaWRhdGUucmVzb2x2ZWQgJiYgY2FuZGlkYXRlLmRlcHMuZXZlcnkoZGVwID0+IHRoaXMuaXNDaGVja2FibGUoY2FuZGlkYXRlc01hcFtkZXBdLCBjYW5kaWRhdGVzTWFwKSk7ICAgICAgICAgICAgXG4gICAgICAgICB9XG4gICAgICAgICBcbiAgICAgICAgIHJldHVybiAoY2FuZGlkYXRlLmNoZWNrYWJsZSAhPT0gZmFsc2UpOyAvLyBoYW5kbGVzIGNpcmN1bGFyIGdyYXBoIGJlY2F1c2Ugc2VlbiA9IHRydWUgYnV0IGNoZWNrYWJsZSA9IHVuZGVmaWVuZFxuICAgICAgfVxuICAgfVxuICAgXG5cdC8qXG5cdFx0UmV0dXJucyB0aGUgZGlhZ25vc3RpY3MgZm9yIHRoaXMgZmlsZSBhbmQgYW55IGZpbGVzIHdoaWNoIGl0IHVzZXMuXG5cdFx0RWFjaCBmaWxlIGlzIG9ubHkgY2hlY2tlZCBvbmNlLlxuXHQqL1xuXHRwcml2YXRlIGdldEFsbERpYWdub3N0aWNzKGNhbmRpZGF0ZXM6IENhbmRpZGF0ZVtdKTogdHMuRGlhZ25vc3RpY1tdIHtcblx0XHQvLyBoYWNrIHRvIHN1cHBvcnQgaHRtbCBpbXBvcnRzXG4gICAgICBsZXQgZmlsZWxpc3QgPSBjYW5kaWRhdGVzLm1hcCgoZGVwKSA9PiBkZXAubmFtZSkuY29uY2F0KFtfX0hUTUxfTU9EVUxFX19dKTtcblx0XHRsZXQgcHJvZ3JhbSA9IHRzLmNyZWF0ZVByb2dyYW0oZmlsZWxpc3QsIHRoaXMuX29wdGlvbnMsIHRoaXMuX2hvc3QpO1xuXG5cdFx0cmV0dXJuIGNhbmRpZGF0ZXMucmVkdWNlKChlcnJvcnMsIGNhbmRpZGF0ZSkgPT4ge1xuXHRcdFx0aWYgKGNhbmRpZGF0ZS5jaGVja2FibGUgJiYgIWNhbmRpZGF0ZS5maWxlLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGNhbmRpZGF0ZS5maWxlLmVycm9ycyA9IFtdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIWNhbmRpZGF0ZS5maWxlLmlzTGliRmlsZSkge1xuICAgICAgICAgICAgICAgY2FuZGlkYXRlLmZpbGUuZXJyb3JzID0gcHJvZ3JhbS5nZXRTeW50YWN0aWNEaWFnbm9zdGljcyhjYW5kaWRhdGUuZmlsZSlcbiAgICAgICAgICAgICAgICAgIC5jb25jYXQocHJvZ3JhbS5nZXRTZW1hbnRpY0RpYWdub3N0aWNzKGNhbmRpZGF0ZS5maWxlKSk7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG5cblx0XHRcdFx0Y2FuZGlkYXRlLmZpbGUuY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JzLmNvbmNhdChjYW5kaWRhdGUuZmlsZS5lcnJvcnMpO1xuXHRcdFx0fVxuICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JzO1xuICAgICAgICAgfSAgICAgICAgXHRcdFx0XG5cdFx0fSwgcHJvZ3JhbS5nZXRHbG9iYWxEaWFnbm9zdGljcygpKTtcblx0fVxufSJdfQ==